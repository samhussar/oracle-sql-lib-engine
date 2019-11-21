/**
 * 依赖全局的 oracledb 对象，使用里面的连接池执行 SQL
 */

const debugSqlExec = require('debug')('osql:exec');
const { default: logger } = require('./logger.js');
const calculateBindObj = require('./middleware/calculateBindObj.js');
const processOutBinds = require('./middleware/processOutBinds.js');
const cfg = require('./cfg.js');

const { ConnectionTimeSlowThres, ExecutionTimeSlowThres } = cfg;

async function executeSqlModule(m, reqOrigin, internal) {
  // 获取最终的请求，也即转换后的请求
  const req = (() => {
    if (m.inConverter && typeof m.inConverter === 'function') {
      // inConverter 可以直接修改 req 内容，而不返回新的 req 对象
      return m.inConverter(reqOrigin) || reqOrigin;
    }
    return reqOrigin;
  })();
  internal.req = req;

  // 获取最终要执行的 SQL 文本
  const sqltext = (() => {
    if (m.sqltext instanceof Function) {
      return m.sqltext(req);
    }
    return m.sqltext;
  })();
  internal.sqltext = sqltext;

  // 根据原始 sql 文本，里面的绑定参数，请求，和配置的绑定对象，计算中最终用于执行的绑定对象
  const bindObj = calculateBindObj(sqltext, req, m.bindObj);
  internal.bindObj = bindObj;

  debugSqlExec('path', m.path);
  debugSqlExec('request', req);
  debugSqlExec(sqltext);
  debugSqlExec('bindObj', bindObj);

  // 从连接池获取连接
  const beforeConnectionTime = Date.now();
  let connection;
  try {
    connection = await oracledb.getConnection(m.pool);
  } catch (e) {
    return {
      error: e,
      errorType: 'connect',
      meta: { },
    };
  }
  const connectionTime = Date.now() - beforeConnectionTime;
  if (connectionTime > ConnectionTimeSlowThres) {
    logger.warn({ type: 'slow', connectionTime }, { path: m.path, req: reqOrigin });
  }

  connection.module = 'ora-sql-lib';
  connection.action = m.path;
  // connection.clientId 回头写 staffId 或者 callId

  const beforeExecutionTime = Date.now();
  let sqlresult;
  let error;
  try {
    sqlresult = await connection.execute(sqltext, bindObj, m.options || {});
  } catch (e) {
    error = e;
  }

  const executionTime = Date.now() - beforeExecutionTime;
  if (executionTime > ExecutionTimeSlowThres) {
    logger.warn({ type: 'slow', executionTime }, { path: m.path, req: reqOrigin });
  }

  let returnResult;
  if (sqlresult) { // 执行正常分支
    await processOutBinds(sqlresult, bindObj);
    if (sqlresult.rowsAffected || !sqlresult.rows) {
      await connection.commit();
    }
    await connection.release(); // 处理完响应第一时间释放连
    if (m.outConverter && typeof m.outConverter === 'function') {
      // outConverter 可以直接修改 sqlresult 内容，而不返回新的 sqlresult 对象
      try {
        sqlresult = m.outConverter(sqlresult, req) || sqlresult;
      } catch (e) {
        returnResult = {
          error: e,
          errorType: 'converter',
          meta: {
            connectionTime,
            executionTime,
          },
        };
      }
    }
    returnResult = returnResult || {
      sqlresult,
      meta: {
        connectionTime,
        executionTime,
      },
    };
  } else { // 执行异常分支
    returnResult = {
      error,
      errorType: 'execute',
      meta: {
        connectionTime,
        executionTime,
      },
    };
    await connection.release(); // 处理完响应第一时间释放连接
  }
  return returnResult;
}

module.exports = executeSqlModule;
