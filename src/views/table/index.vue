<template>
  <div class="app-container">
    <el-table :data="list"  element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      <el-table-column label="任务名" min-width="150px">
        <template slot-scope="scope">
          {{scope.row.title}}
        </template>
      </el-table-column>
      <el-table-column label="处理人" width="110" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>
      <el-table-column label="考察点" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.pageviews}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="处理状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="开始时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.display_time}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="success"
            @click="handleDelete(scope.$index, scope.row)">发布</el-button>
          <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
       </el-table-column>
    </el-table>
<el-dialog title="详情" :visible.sync="dialogTableVisible">
  <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
    <el-form-item label="任务名">
      <el-input v-model="temp.title" placeholder="请填写任务名称"></el-input>
    </el-form-item>
    <el-form-item label="处理人">
      <el-input v-model="temp.author" placeholder="请填写处理人"></el-input>
    </el-form-item>
    <el-form-item label="考察点">
      <el-select v-model="temp.pageviews" placeholder="请选择考察点">
        <el-option v-for="item in  statusOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="temp.status" placeholder="请选择当前状态">
        <el-option v-for="item in  statusOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="开始时间">
      <el-date-picker v-model="temp.display_time" type="datetime" placeholder="请选择开始时间">
      </el-date-picker>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  data() {
    return {
      temp: {
        //id: undefined,
        //importance: 1,
        author:'',
        //remark: '',
        pageviews:'',
        display_time:'',
        //timestamp: new Date(),
        title: '',
        //type: '',
        status: 'published'
      },
      statusOptions: ['published', 'draft', 'deleted'],
      dialogTableVisible:false,
      dialogStatus:'',
      list: null,
      listLoading: true
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleCreate() {
      //this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogTableVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    handleEdit(index, row) {
      console.log(row)
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      // this.dialogStatus = 'update'
      this.dialogTableVisible = true
      this.dialogStatus = 'updata'
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogTableVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    fetchData() {
      getList().then(response => {
        
        alert("1")
        this.list = response.data.item
        this.listLoading = false
      })
    }
  }
}
</script>
