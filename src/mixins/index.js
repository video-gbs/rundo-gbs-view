export default {
  methods: {
    handleSizeChange(v) {
      this.params.size = v
      this.getList()
      // 执行搜索
    },
    paginationCurrentChange(v) {
      this.params.current = v
      this.getList()
      // 执行搜索
    },
    deleteFn(v, detfn, getFn) {
      this.$alert(
        `确定要删除 '${v.title || v.realName || v.name}' 吗?`,
        '删除操作',
        {
          dangerouslyUseHTMLString: true,
          showCancelButton: true
        }
      ).then((action) => {
        detfn &&
          detfn(v.id).then((res) => {
            res.code === 10000 && this.$message.success('删除成功')
            getFn && getFn()
          })
      })
    },
    editShowFn(v, fn) {
      fn &&
        fn(v.id, v.isShow)
          .then((res) => {
            // res.code === 10000 && (v.isShow = v.isShow ? 0 : 1)
          })
          .catch(() => {
            v.isShow = v.isShow ? 0 : 1
          })
    }
  }
}
