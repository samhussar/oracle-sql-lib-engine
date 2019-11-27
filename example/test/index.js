
require('./lib.js').testAll(async t => {
  // await t('/selectDual');

  // await t('/query/queryMainBasic');
  // await t('/query/queryMainParam');
  // await t('/query/queryMainParam', { custName: 'Li' });
  // await t('/query/selectMainInto', { custName: 'LiYuze' });

  // await t("/dml/insertMain?custName=LiYong");
  // await t("/dml/insertMain?custName=LiXinyan");
  // await t("/dml/insertMainReturn?custName=LiYuze");
  // await t("/dml/updateMainStatus?tradeId=3&status=9");
  // await t("/dml/deleteMain?custName=LiXinyan");
  // await t("/dml/insertMain?custName=LiXinyan");
  // await t("/dml/updateMainReturn?tradeId=4&status=9");
  // await t("/dml/deleteMainReturn?tradeId=28");
  // await t("/dml/updateMultiReturn?status=7");

  // await t("/storedpl/createProcedure");
  // await t("/storedpl/execProcedure?sts=1");

  // await t("/typebind/bindNull");
  // await t("/typebind/bindNull", { none: ''});
  // await t("/typebind/bindNull", { none: 1});
  // await t("/typebind/bindNull", { none: 'y'});

  // await t("/plsql/basicBind", {xing: 'Li'})
  // await t("/plsql/cursorBind", { type: 'table', pattern: 'OSQL%' });
  // await t("/plsql/cursorBind", { type: 'index', pattern: 'OSQL%' });
  // await t("/plsql/cursorBind");
  // await t("/plsql/dmlRollback", { tradeId: 41 });
  // await t("/plsql/dmlRollback", { tradeId: 42 });

  // await t("/dynamic/dyna", { verbose: 1, tname: 'OSQL_' });
  // await t("/dynamic/dyna", { verbose: 0, tname: 'OSQL_' });
  // await t("/dynamic/dyna", { verbose: 1, blocks: 1000000, orderBy: 'blocks asc' });
  // await t("/dynamic/dyna", { tname: 'OSQL_', colname: 'a.*' });
  // await t("/dynamic/dyna", { tname: 'OSQL_', colname: 'a.NUM_ROWS,a.BLOCKS' });
  // await t("/dynamic/inArray", { tnames: ['OSQL_MAIN', 'OSQL_SUB'] });

  // await t("/ddl/createNumberArrayType");
  // await t("/ddl/createVarchar2ArrayType");
  // await t("/ddl/createArrayTypesPackage");

  // await t("/bulk/insertArray", { custNames: ['LiXinyan', 'LiYuze'] });
  // await t("/bulk/deleteArray", { tradeIdList: [46, 47] });
  // await t("/bulk/updateArray", { tradeIdList: [50, 51] });
  // await t("/bulk/selectInfoArray");
});
