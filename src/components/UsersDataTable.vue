<template>
  <q-table
    class="q-mt-lg"
    :rows="users"
    row-key="id"
    flat
    :loading="loadingUsers"
    :columns="columns"
    :rows-per-page-options="[]"
    :rows-per-page-label="null"
    binary-state-sort
    :filter="filter"
    @request="onRequest"
    v-model:pagination="pagination"
  >
    <template v-slot:top-left>
        <q-input class="q-pr-md q-mb-md" dense debounce="600" v-model="filter.name" placeholder="Nome"/>
        <q-input class="q-px-md q-mb-md" dense debounce="600" v-model="filter.email" placeholder="Email"/>
        <q-select 
          style="min-width: 210px" 
          dense 
          class="q-px-md q-mb-md" 
          label="Gênero" 
          v-model="filter.gender" 
          :options="genders"
        >
          <template v-if="filter.gender" v-slot:append>
            <q-icon name="cancel" @click.stop.prevent="filter.gender = ''" class="cursor-pointer" />
          </template>
        </q-select>
        <q-select 
          style="min-width: 210px" 
          dense 
          class="q-px-md q-mb-md" 
          label="Status" 
          v-model="filter.status" 
          :options="status"
        >
          <template v-if="filter.status" v-slot:append>
            <q-icon name="cancel" @click.stop.prevent="filter.status = ''" class="cursor-pointer" />
          </template>
        </q-select>
    </template>
    <template v-slot:top-right>
        <q-btn color="primary" icon-right="add" label="Adicionar" @click="openUserDialog('add', { })"/>  
    </template>
    <template v-slot:body-cell-status="props">
      <q-td :props="props">
        <div>
          <q-toggle :model-value="props.value == 'active' ? true : false" @click="toggleStatusUser(props.row)" />
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-edit="props">
      <q-td :props="props">
        <q-btn flat round color="primary" icon="edit" @click="openUserDialog('edit', props.row)"/>
      </q-td>
    </template>
    <template v-slot:body-cell-delete="props">
      <q-td :props="props">
        <q-btn flat round color="negative" icon="delete_outline" @click="deleteUser(props.row)" />
      </q-td>
    </template>
  </q-table>
</template>

<script>
import { storeToRefs } from 'pinia'
import { onMounted, defineComponent,ref } from 'vue'
import { usersStore } from '../stores/UsersStore'

export default defineComponent({  
  name: 'UsersDataTable',

  setup () {
    const store = usersStore()
    const { users, loadingUsers, pagination, filter } = storeToRefs(usersStore())
    const genders = [ 'male', 'female' ]
    const status = [ 'active', 'inactive' ]

    const columns = [
      { name: 'name',   label: 'Nome',    align: 'left',   field: 'name',   sortable: false },
      { name: 'email',  label: 'Email',   align: 'left',   field: 'email',  sortable: false },
      { name: 'gender', label: 'Gênero',  align: 'left',   field: 'gender', sortable: false },
      { name: 'id',     label: 'ID',      align: 'left',   field: 'id',     sortable: false },
      { name: 'status', label: 'Status',  align: 'center', field: 'status', sortable: false },
      { name: 'edit',   label: 'Editar',  align: 'center', field: 'edit',   sortable: false },
      { name: 'delete', label: 'Deletar', align: 'center', field: 'delete', sortable: false },
    ]


    function onRequest (props) {
      const { page } = props.pagination
      const filter = props.filter

      store.searchUsers(page, filter);
    }

    function openUserDialog (action, props) {
      const user = props
      store.openUserDialog(action, user)
    }

    function toggleStatusUser(row){
      let user = row;

      user.status = user.status == 'active' ? 'inactive' : 'active'
      store.updateUser(user)
    }

    function deleteUser(row){
      store.deleteUser(row)
    }

    onMounted(()=> {
      store.initializeUsers();
    })
    
    return {
      users,
      loadingUsers,
      columns,
      genders,
      status,
      pagination,
      filter,

      toggleStatusUser,
      deleteUser,
      onRequest,
      openUserDialog
    }
  }
})
</script>
