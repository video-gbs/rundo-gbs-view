import jsonBigint from 'json-bigint'

const jb = [
  function (data) {
    const j = jsonBigint({
      storeAsString: true
    })
    return j.parse(data)
  }
]

export default jb
