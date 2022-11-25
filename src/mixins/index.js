export default {
  methods: {
    handleSizeChange(v) {
      console.log('v')
      this.params.size=v
      this.getList()
      // 执行搜索
    },
    paginationCurrentChange(v) {
      console.log('v2')
      this.params.current=v
      this.getList()
      // 执行搜索
    },
    deleteFn(v, detfn,getFn) {
      this.$alert(`确定要删除 '${v.title || v.realName || v.name}' 吗?`, '删除操作', {
        dangerouslyUseHTMLString: true,
        showCancelButton: true
      }).then(action => {
        detfn&&detfn(v.id).then(res=>{
          res.code===10000&&(this.$message.success('删除成功'))
          this.getFn&&this.getFn()
        })
      })
    },
    editShowFn(v,fn){
      fn&&fn(v.id, { isShow: v.isShow }).then(res => {}).catch(() => {
        v.isShow = v.isShow ? 0 : 1
      })
    }
  }
}