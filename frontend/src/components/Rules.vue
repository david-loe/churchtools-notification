<template>
  <div>
    <div class="modal fade" id="ruleModal" tabindex="-1" aria-labelledby="ruleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 v-if="modalMode === 'add'" class="modal-title" id="ruleModalLabel">
              {{ $t('labels.newRule') }}
            </h5>
            <h5 v-else-if="modalMode === 'edit'" class="modal-title" id="ruleModalLabel">
              {{ modalRule.name }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <RuleForm :mode="modalMode" @cancel="ruleModal.hide()" :rule="modalRule" @add="addRule" @edit="addRule"></RuleForm>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row justify-content-between">
        <div class="col-auto">
          <h1>{{ $t('headlines.rules') }}</h1>
        </div>
        <div class="col-auto">
          <button class="btn btn-secondary" @click="showModal('add')">
            <i class="bi bi-plus-lg"></i>
            <span class="ms-1">{{ $t('labels.addRule') }}</span>
          </button>
        </div>
      </div>
      <div>
        <ul class="list-group">
          <li v-for="rule of $root.rules" :key="rule.name" class="list-group-item">
            <div class="row">
              <div class="col-auto">
                {{ rule.name }}
              </div>
              <div class="col-auto">
                {{ rule.lastEvaluation }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import RuleForm from './Rules/RuleForm.vue'
import { Modal } from 'bootstrap'
export default {
  name: 'Rules',
  components: {
    RuleForm,
  },
  props: [],
  data() {
    return {
      ruleModal: undefined,
      modalMode: 'add',
      modalRule: {name: '', conditions: []},
    }
  },
  methods: {
    showModal(mode, rule){
      this.modalMode = mode
      this.modalRule = rule
      this.ruleModal.show()
    },
    async addRule(rule){
      this.$root.rules = await this.$root.poster('rules', {rule: rule, id: this.$root.user.id}, false, (res) =>{
        if(res.status == 200){
          this.ruleModal.hide()
        }
      })
      console.log(this.$root.rules)
    }
  },
  async mounted() {
    this.ruleModal = new Modal(document.getElementById('ruleModal'), {})
  },
  async beforeMount() {
    await this.$root.load()
  },
}
</script>

<style>
</style>