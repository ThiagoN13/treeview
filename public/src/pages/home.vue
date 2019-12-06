<template>
  <div class="app">
    <div class="header">
      <div class="col-auto">
        <h1 class="text-white">Lista de compras</h1>
      </div>

      <div class="col-right">
        <button @click="openModal">
          <img src="../assets/plus.png">
          Adicionar nível
        </button>
      </div>
    </div>

    <div class="container">
      <tree-view
        v-model="nodes"
        :depth="0"
        @delete="removeItem"
        @remove-child="updateItem"
        @update="updateItem">
      </tree-view>
    </div>

    <modal :visible="modalVisible" @close="closeModal">
      <h1 class="mb-5">Adicionar nível</h1>

      <input class="w-100 mb-2" type="text" v-model="form.name">

      <select name="children" multiple v-model="form.children" class="w-100 mb-5">
        <option :value="item" v-for="(item, index) in valuesRoot" :key="index">
          {{ item.name }}
        </option>
      </select>

      <button @click="addItem">Adicionar</button>
    </modal>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'home',

  data () {
    return {
      form: {
        parentId: null,
        children: []
      },
      modalVisible: false,
      nodes: []
    }
  },

  created () {
    this.fetchTree()
  },

  methods: {
    openModal () {
      this.modalVisible = true
    },

    closeModal () {
      this.modalVisible = false
    },

    async fetchTree () {
      const { data = [] } = await axios.get('https://localhost:5001/items')

      this.nodes = data
    },

    async removeItem (id) {
      await axios.delete(`https://localhost:5001/items/${id}`)

      this.fetchTree()
    },

    async updateItem (payload) {
      console.log('update ' + payload.name)
      // await axios.put('https://localhost:5001/items', this.form)

      // this.fetchTree()
    },

    async addItem () {
      await axios.post('https://localhost:5001/items', this.form)

      await this.fetchTree()

      this.closeModal()
    }
  },

  computed: {
    valuesRoot () {
      let values = this.nodes

      this.nodes.forEach(item => {
        values = values.concat(item.children)
      })

      return values
    }
  }
}
</script>

<style>
  body {
    margin: 0;
  }

  .modal .w-100 {
    width: 100%;
  }

  .modal .mb-2 {
    margin-bottom: 20px
  }

  .modal .mb-5 {
    margin-bottom: 50px
  }

  .modal input {
    font-size: 14px;
    padding: 5px
  }

  .modal select {
    font-size: 14px;
    padding: 5px;
  }

  .modal button {
    float: right;
    font-weight: 600;
    font-size: 16px;
    padding: 10px 20px 10px 20px;
    border-radius: 10px
  }

  .header {
    display: flex;
    padding: 20px 100px 20px 100px;
    text-align: center;
    background-color: #3D3D58
  }

  .header .col-right {
    width: 70%;
    text-align: right;
    align-items: center;
    justify-content: flex-end;
    display: flex;
  }

  .header button {
    font-weight: 600;
    font-size: 16px;
    padding: 10px 20px 10px 20px;
    border-radius: 10px
  }

  .header button img {
    margin-right: 10px;
  }

  .col-auto {
    text-align: left;
    width: 30%;
  }

  .text-white {
    color: #FFFF
  }

  .container {
    margin-left: 100px;
    margin-right: 100px
  }

  .app {
    width: 100%
  }
</style>
