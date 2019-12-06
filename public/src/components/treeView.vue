<template>
  <div class="tree-menu" :style="indent">
    <div class="label-wrapper border-bottom" @click="toggleChildren" v-if="depth !== 0">
      <div :class="labelClasses">
        <div class="caret">
          <img src="../assets/caret-right.png" v-if="!showChildren && value">
          <img src="../assets/caret-down.png" v-else-if="value">
        </div>

        <img src="../assets/folder.png" v-if="!showChildren && value">
        <img src="../assets/folder-open.png" v-else>

        <div v-if="isEdit" class="text-input">
          <input type="text" @click="clickInput" v-model="form.name">
          <img src="../assets/check.png" @click="submitEdit">
        </div>

        <div v-else :style="{ 'display': 'inline' }">
          <b>{{ node.name }}</b>

          <button @click.stop="openEdit">
            <img src="../assets/pen.png">
          </button>

          <button @click.stop="remove(node)">
            <img src="../assets/trash-alt.png">
          </button>
        </div>
      </div>
    </div>

    <div v-if="showChildren || depth === 0">
      <tree-view
        v-for="(node, index) in value"
        :key="index"
        v-model="node.children"
        :node="node"
        :depth="depth + 1"
        @update="update"
        @remove-child="removeChild(arguments[0], node)"
        @delete="remove">
      </tree-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'treeView',

  props: {
    node: {
      type: Object
    },

    value: {
      type: Array
    },

    depth: {
      type: Number
    }
  },

  data () {
    return {
      form: {},
      isEdit: false,
      showChildren: false
    }
  },

  computed: {
    labelClasses () {
      return { 'has-children': this.value }
    },

    indent () {
      return { transform: `translate(${this.depth * 20}px)` }
    }
  },

  methods: {
    clickInput (event) {
      event.stopPropagation()
    },

    submitEdit () {
      this.isEdit = false
    },

    openEdit () {
      this.form = Object.assign({}, this.node)
      this.isEdit = true
    },

    update (data) {
      this.$emit('update', data)
    },

    remove (payload) {
      if (this.depth === 1) {
        return this.$emit('delete', id)
      }

      const { parent } = this.$options

      const index = parent.value.findIndex(item => item.id === payload.id)
      const arrayCopy = parent.value.slice()

      arrayCopy.splice(index, 1)

      this.$emit('remove-child', { children: arrayCopy })
    },

    removeChild (child, node) {
      child.children = node.children
      if (!this.node) {
        return this.$emit('update', child)
      }
      const data = Object.assign({}, this.node, child)

      this.$emit('remove-child', data)
    },

    toggleChildren () {
      this.showChildren = !this.showChildren
    }
  }
}
</script>

<style>
body {
  font-family: "Open Sans", sans-serif;
  font-size: 18px;
  font-weight: 300;
  line-height: 1em;
}

.tree-menu {
  text-align: left;
}

.border-bottom {
  border-bottom: 1px solid #ccc;
}

.tree-menu .label-wrapper {
  display: flex;
  padding: 10px;
  margin-top: 20px;
}

.tree-menu .label-wrapper b {
  margin-right: 20px;
  color: #3D3D58
}

.text-input {
  display: inline;
}

.text-input input {
  display: inline;
  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom: 1px solid #3D3D58
}

.tree-menu .label-wrapper .caret {
  margin-right: 5x;
  display: inline-block;
  width: 10px
}

.tree-menu .label-wrapper .has-children {
  cursor: pointer;
}
</style>
