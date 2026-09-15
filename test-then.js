async function runQuery() { return { data: [{id: 1}], error: null }; }
const builder = {
  then: (resolve, reject) => {
     const p = runQuery().then(r => { return { data: r.data[0], error: r.error }; });
     return resolve ? p.then(resolve, reject) : p;
  }
};
async function test() {
  const result = await builder;
  console.log(result);
}
test();
