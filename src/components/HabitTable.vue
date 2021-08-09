<template>
  <DialogNoReason ref="NoReason" />
  <el-table :data="displayData" class="el_table">
    <el-table-column>
      <template #header>
        <div id="handleDate">
          <el-button @click="aExportData(startvalue, tableData)" size="mini"
            >导出数据</el-button
          >
          <el-button
            @click="clearLocalStorage"
            size="mini"
            style="margin-top: 10px; margin-left: 0px"
            >清除数据</el-button
          >
        </div>
      </template>
      <!-- the :data="tableData" has a key : data -->
      <el-table-column prop="date" width="128">
        <template #header>
          <div id="data_header">
            <p>起始日期</p>
            <!--  startvalue is watched -->
            <el-date-picker
              v-model="startvalue"
              placeholder="起始日期"
              prefix-icon="null"
              size="mini"
              style="width: 95px"
            >
            </el-date-picker>
          </div>
        </template>
      </el-table-column>
    </el-table-column>

    <!-- habit name -->
    <el-table-column v-for="habit in habits" :label="habit.name">
      <!--  habit explain -->
      <el-table-column :label="habit.explain">
        <!-- the main content -->
        <template #default="scope">
          <div id="inner_button">
            <!-- the yes button -->
            <el-button
              @click="handleYes(scope.row, habit.name)"
              size="mini"
              :type="
                scope.row.complete_yes[habit.name]
                  ? scope.row.complete_yes[habit.name]
                  : null
              "
            >
              √
            </el-button>

            <!-- el_tooltip :  the bottom content of the no button -->
            <!-- disabled 禁用  false 表示可用  -->
            <el-tooltip
              placement="bottom"
              effect="light"
              :disabled="scope.row.complete_no[habit.name] ? false : true"
            >
              <!-- the bottom content -->
              <template #content>
                {{ scope.row.complete_no[habit.name] }}
              </template>
              <!-- no buttom -->
              <el-button
                @click="handleNo(scope.row, habit.name)"
                :type="scope.row.complete_no[habit.name] ? 'danger' : null"
                size="mini"
                >×</el-button
              >
            </el-tooltip>
          </div>

          <p id="explain_text">{{ scope.row.complete_no[habit.name] }}</p>
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>

  <el-pagination
    id="bottom_pagination"
    background
    layout="prev, pager, next"
    :total="100"
    :page-size="7"
    :current-page="currentPage"
    @current-change="changePage"
  />
</template>

<script>
import DialogNoReason from "./DialogNoReason.vue";
import { ref } from "vue";
import exportData from "./exportData";
const NoReason = ref();
export default {
  name: "HabitTable",
  components: {
    DialogNoReason,
  },
  setup() {
    const aExportData = exportData;
    return {
      aExportData,
      NoReason,
    };
  },
  data() {
    return {
      currentPage: 1,
      startvalue: "",
      existPage: new Set(),
      habits: [
        { name: "理性", explain: "不做事后会让自己后悔的事情" },
        { name: "当下", explain: "活在当下，不留恋，不妄想" },
        { name: "节制", explain: "食不过饱" },
        // { name: "秩序", explain: "有条不紊，注重细节" },
        { name: "决心", explain: "决心做的事情必须去做，不要拖延" },
        { name: "慎言", explain: "言必益人益己，避免无益的闲聊" },
        // { name: "行动", explain: "完成当下可以完成的事情，不要拖延" },
        { name: "思考", explain: "花半个小时以上阅读，深度思考" },
        { name: "适度", explain: "劳逸结合，注重效率" },
        // {
        //   name: "节俭",
        //   explain: "目的性购物，买不起就不要浪费时间看；钱要花在益处，切记浪费",
        // },
        { name: "整洁", explain: "身体、衣服和住所保持干净整洁" },
        { name: "早睡", explain: "晚上十一点之前睡觉" },
        { name: "早起", explain: "早上七点之前起床" },
      ],
      tableData: [],
      displayData: [],
    };
  },
  methods: {
    handleYes(row, name) {
      row["complete_yes"][name] = "success";
      row["complete_no"][name] = "";
      const parsed = JSON.stringify(this.tableData);
      localStorage.setItem("tableData", parsed);
    },
    handleNo(row, name) {
      row["complete_no"][name] = row["complete_no"][name]
        ? row["complete_no"][name]
        : " ";
      row["complete_yes"][name] = "";
      NoReason.value.open(row, name, this.tableData);
    },
    clearLocalStorage() {
      localStorage.removeItem("tableData");
      localStorage.removeItem("startvalue");
      window.location.href = "/";
    },
    changePage(val) {
      this.currentPage = val;
      // if no exist page add , else jump
      let aNewDate = new Date(
        Date.parse(this.startvalue) + 1000 * 3600 * 24 * (val - 1) * 7
      );

      if (!this.existPage.has(val)) {
        this.existPage.add(val);
        this.addData(aNewDate);
        for (let start = (val - 1) * 7; start < (val - 1) * 7 + 7; start++) {
          this.displayData[start - (val - 1) * 7] = this.tableData[start];
        }
      } else {
        for (let start = (val - 1) * 7; start < (val - 1) * 7 + 7; start++) {
          this.displayData[start - (val - 1) * 7] = this.tableData[start];
        }
      }

      console.log(this.existPage);
    },
    addData(date) {
      for (let i = 0; i < 7; i++) {
        let aDate = new Date(Date.parse(date) + 1000 * 3600 * 24 * i);
        let convertDay = {
          0: "天",
          1: "一",
          2: "二",
          3: "三",
          4: "四",
          5: "五",
          6: "六",
        };
        this.tableData.push({
          date: `${aDate.getMonth() + 1}月${aDate.getDate()}日 星期${
            convertDay[aDate.getDay()]
          }`,
          complete_yes: {},
          complete_no: {},
        });
      }
    },
  },
  mounted() {
    // https://cn.vuejs.org/v2/cookbook/client-side-storage.html
    if (localStorage.getItem("tableData")) {
      try {
        this.tableData = JSON.parse(localStorage.getItem("tableData"));
      } catch (e) {
        localStorage.removeItem("tableData");
      }
    }
    if (localStorage.startvalue) {
      this.startvalue = localStorage.startvalue;
    }

    if (this.tableData.length) {
      this.existPage.add(1);
      let aNewDate = new Date(Date.parse(this.startvalue) + 1000 * 3600 * 24);
      for (let start = 0; start < 7; start++) {
        this.displayData[start] = this.tableData[start];
      }
    }
  },
  watch: {
    startvalue(date) {
      // if tableData length is zero, add Data
      if (!this.tableData.length) {
        this.addData(date);
        this.existPage.add(1);
        let aNewDate = new Date(Date.parse(this.startvalue) + 1000 * 3600 * 24);
        for (let start = 0; start < 7; start++) {
          this.displayData[start] = this.tableData[start];
        }
      }
      localStorage.startvalue = date;
    },
  },
};
</script>

<style>
.el_table {
  margin: 0 auto;
  /* https://blog.iwnweb.com/kai-fa/infinite-jitter-of-element-ui-table-and-its-solution/ */
  width: 99.9% !important;
}

.el-input--prefix .el-input__inner {
  padding-left: 16px !important;
}

.el-input--suffix .el-input__inner {
  padding-right: 0px !important;
}
.el-input__inner {
  margin-top: 5px;
}

#handleDate {
  display: flex;
  flex-direction: column;
}

#data_header {
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#inner_button {
  display: flex;
  justify-content: center;
}
#explain_text {
  margin-top: 5px;
  height: 21px;
  font-size: 12px;
  font-weight: bold;
  color: rgb(148, 148, 148);
  overflow: auto;
}
#explain_text::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}
/* overflow-y: auto;
  background-color: #222832;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none; */
#bottom_pagination {
  text-align: center;
  margin-top: 12px;
  margin-bottom: 12px;
}
</style>