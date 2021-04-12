<template>
    <div>
        <el-checkbox-group v-model="checkList" @change="handleChange">
        <el-checkbox :label="item[keyId]"  v-for="item in list" :key="item">{{item[label]}}</el-checkbox>
        </el-checkbox-group>
    </div>

</template>

<script>
    export default {
    props: {
    value: [String, Array],
    list: {
    type: Array,
    default () {
    return [];
}
},
    keyId: {
    type: String,
    default: 'value',
},
    label: {
    type: String,
    default: 'label'
},
},
    data() {
    return {
    checkList: [],
}
},
    watch: {
    value: {
    immediate: true,
    handler(val) {
    this.checkList = [ val ];
}
}
},

    methods: {
    handleChange(arr) {
    this.checkList.length > 1 && this.checkList.shift();

    this.$nextTick(() => {
    let val = this.checkList.length > 0 ? this.checkList[0] : '';
    this.$emit('change', val);
    this.$emit('input', val);
})
}
},
}
</script>
