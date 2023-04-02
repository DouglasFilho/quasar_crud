<template>
  <q-page>
    <UserDialog/>
    <q-card>
      <div class="text-h5 q-py-md q-px-sm text-primary">Gestão de usuários</div>
    </q-card>
    <q-card>
      <UsersDataTable/>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import UsersDataTable from 'src/components/UsersDataTable.vue'
import UserDialog from 'src/components/UserDialog.vue';

export default defineComponent({
  name: 'UsuariosPage',

  components: {
    UsersDataTable,
    UserDialog
  },
})
</script>
