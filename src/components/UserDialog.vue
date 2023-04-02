<template>
  <q-dialog v-model="userDialog.visibility" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="perm_identity" color="primary" text-color="white" />
        <div v-if="userDialog.action == 'add'" class="text-h6 q-ml-md">Adicionar um novo usuário</div>
        <div v-if="userDialog.action == 'edit'" class="text-h6 q-ml-md">Editar usuário</div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-6">
            <q-input 
              outlined 
              dense 
              class="q-mb-md" 
              placeholder="Nome" 
              v-model="userDialog.user.name"     
              :rules="[val => !!val || 'Campo obrigatório', val => val.length < 191 || 'Tamanho máximo permitido 191 caracteres']"
              ref="nameInput"
            />
          </div>
          <div class="col-6">
            <q-input 
              outlined 
              dense 
              class="q-pl-md q-mb-md" 
              placeholder="Email" 
              v-model="userDialog.user.email"
              :rules="[val => !!val || 'Campo obrigatório', val => /.+@.+\..+/.test(val) || 'Email inválido', val => val.length < 191 || 'Tamanho máximo permitido 191 caracteres']"
              ref="emailInput"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <q-select 
              outlined 
              dense 
              class="q-mb-md" 
              label="Status" 
              v-model="userDialog.user.status" 
              :options="status"
              :rules="[val => !!val || 'Campo obrigatório']"
              ref="statusInput"
            />
          </div>
          <div class="col-6">
            <q-select 
              outlined 
              dense 
              class="q-pl-md q-mb-md" 
              label="Gênero" 
              v-model="userDialog.user.gender" 
              :options="genders"
              :rules="[val => !!val || 'Campo obrigatório']"
              ref="genderInput"
            />
          </div>
        </div>
      </q-card-section>
      
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="negative" v-close-popup @click="reload()"/>
        <q-btn flat label="Salvar"   color="positive" @click="userDialog.action == 'edit' ? updateUser() : createUser()"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { storeToRefs } from 'pinia'
import { defineComponent } from 'vue'
import { usersStore } from '../stores/UsersStore'


export default defineComponent({  
  name: 'ModalUser',
  setup () {
    const store = usersStore()
    const { userDialog } = storeToRefs(usersStore())
    const genders = [ 'male', 'female' ]
    const status = ['active', 'inactive' ]

    function updateUser(){
      const user = userDialog.value.user
      store.updateUser(user)
    }

    function createUser(){
      const user = userDialog.value.user
      if (this.$refs.nameInput.validate() && this.$refs.emailInput.validate() && this.$refs.statusInput.validate() && this.$refs.genderInput.validate()){
        store.createUser(user) 
      }
    }

    function reload(){
      store.searchUsers(store.pagination.page ,store.filter)
    }

    return {
      userDialog,
      genders,
      status, 

      reload,
      createUser,
      updateUser
    }
  }
})

</script>
