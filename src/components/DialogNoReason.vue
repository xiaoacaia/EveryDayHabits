<template>
  <el-dialog title="请输入未完成的原因" width="400px" v-model="visible">
    <!-- 由于当表单只有一个文本框时，按下回车将会触发表单的提交事件，导致页面的刷新 -->
    <el-form :model="ruleForm" @submit.native.prevent>
      <el-form-item>
        <el-input
          type="textarea"
          :rows="10"
          v-model="ruleForm.NoCompleteReason"
        ></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "DialogNoReason",
  emits: ["toFather"],
  data() {
    return {
      visible: false,
      row: "",
      name: "",
      TD: "",
      ruleForm: {
        NoCompleteReason: "",
      },
    };
  },
  methods: {
    submitForm() {
      // https://segmentfault.com/a/1190000022089020
      this.row["complete_no"][this.name] = this.ruleForm.NoCompleteReason
        ? this.ruleForm.NoCompleteReason
        : " ";
      const parsed = JSON.stringify(this.TD);
      localStorage.setItem("tableData", parsed);
      //   this.$emit("toFather", this.row);
      this.visible = false;
    },
    open(row, name, TD) {
      this.row = row;
      this.name = name;
      this.TD = TD;
      this.ruleForm.NoCompleteReason = row["complete_no"][name];
      this.visible = true;
    },
  },
};
</script>

<style>
</style>