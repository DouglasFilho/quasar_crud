import { defineStore } from 'pinia';
import { _http } from 'src/utils/http';
import { Notify, Dialog } from 'quasar'

export const usersStore = defineStore('users', {
  state: () => ({
    users: [],
    userDialog: {
      visibility: false,
      action: '',
      user: {}
    },
    loadingUsers: false,
    filter: { name: '', email: '', gender: '', status: '' },
    pagination: {
      sortBy: 'desc',
      descending: false,
      page: 0,
      rowsPerPage: 10,
      rowsNumber: 0
    }
  }),
  getters: {
    getUsers: (state) => state.users,
    getLoadingUsers: (state) => state.loadingUsers,
    getPagination: (state) => state.pagination,
  },
  actions: {
    async initializeUsers() {
      this.loadingUsers = true;
      this.users = []
      try {
        const res = await _http.get(`https://gorest.co.in/public/v1/users/`)
        this.users = res.data.data
        this.pagination.page = res.data.meta.pagination.page
        this.pagination.rowsNumber = res.data.meta.pagination.total
      }
      catch (error) {
        Notify.create({
          type: 'negative',
          message: error.message
        })
      }
      finally {
        this.loadingUsers = false;
      }
    },
    async searchUsers(page, filter) {
      this.loadingUsers = true;
      this.users = []
      let url = `https://gorest.co.in/public/v1/users/?page=${page}`

      if (filter.name != '') url += `&name=${filter.name}`
      if (filter.gender != '') url += `&gender=${filter.gender}`
      if (filter.status != '') url += `&status=${filter.status}`
      if (filter.email != '') url += `&email=${filter.email}`

      try {
        const res = await _http.get(url)
        this.users = res.data.data
        this.pagination.page = res.data.meta.pagination.page
        this.pagination.rowsNumber = res.data.meta.pagination.total
      }
      catch (error) {
        Notify.create({
          type: 'negative',
          message: error.message
        })
      }
      finally {
        this.loadingUsers = false;
      }
    },
    async createUser(user) {
      const data = {
        "name": user.name,
        "email": user.email,
        "gender": user.gender,
        "status": user.status
      }

      try {
        await _http.post(`https://gorest.co.in/public/v1/users/`, data)

        Notify.create({
          type: 'positive',
          message: 'Usuário criado com sucesso!'
        })
      }
      catch (error) {
        Notify.create({
          type: 'negative',
          message: 'Erro ao criar usuário!'
        })
      }
      finally {
        this.initializeUsers();
        this.userDialog.visibility = false;
      }
    },
    async updateUser(user) {
      const data = {
        "name": user.name,
        "email": user.email,
        "gender": user.gender,
        "status": user.status
      }

      try {
        await _http.put(`https://gorest.co.in/public/v1/users/${user.id}`, data)

        Notify.create({
          type: 'positive',
          message: 'Usuário atualizado com sucesso!'
        })
      }
      catch (error) {
        Notify.create({
          type: 'negative',
          message: 'Erro ao atualizar usuário!'
        })
      }
      finally {
        this.searchUsers(this.pagination.page, this.filter);
        this.userDialog.visibility = false;
      }
    },
    async deleteUser(user) {
      Dialog.create({
        title: 'Atençaõ!',
        message: `Você tem certeza que deseja deletar o usuário ${user.name}?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          const res = await _http.delete(`https://gorest.co.in/public/v1/users/${user.id}`)

          Notify.create({
            type: 'positive',
            message: 'Usuário deletado com sucesso!'
          })
        }
        catch (error) {
          Notify.create({
            type: 'negative',
            message: 'Erro ao deletar usuário!'
          })
        }
        finally {
          this.initializeUsers();
        }
      })
    },
    openUserDialog(action, user) {
      this.userDialog.user = user
      this.userDialog.action = action
      this.userDialog.visibility = !this.userDialog.visibility
    }
  },
});
