<template>
  <form
    autocomplete="off"
    @submit.prevent="$emit(mode, formRule);clear()">
    <div class="mb-2">
      <label for="ruleFormName" class="form-label">
        {{ $t('labels.name') }}
      </label>
      <input type="text" class="form-control" id="ruleFormName" v-model="formRule.name" required :disabled="mode === 'edit'" />
    </div>
    <div class="mb-2">
      <label for="ruleFormConditions" class="form-label">
        {{ $t('labels.conditions') }}
      </label>
      <div v-for="condition of formRule.conditions" :key="condition._id" class="container mb-2">
        <div class="mb-1">
          <select class="form-select" v-model="condition.field" required>
            <option selected disabled value="">{{ $t('labels.field') }}</option>
            <option v-for="field in $root.fields" :key="field.id" :value="field.id">
              {{ field.nameTranslated }}
            </option>
          </select>
        </div>
        <div class="mb-1">
          <select class="form-select" v-model="condition.operator" required>
            <option selected disabled value="">{{ $t('labels.operator') }}</option>
            <option v-for="operator in operators" :key="operator" :value="operator">
              {{ operator }}
            </option>
          </select>
        </div>
        <div class="mb-1">
          <label :for="'value' + condition._id" class="form-label">
            {{ $t('labels.value') }}
          </label>
          <input type="text" class="form-control" :id="'value' + condition._id" v-model="condition.value" required />
        </div>
      </div>
      <div>
        <button type="button" class="btn btn-secondary btn-sm mx-auto" @click="formRule.conditions.push({field: '', operator: ''})">
          {{ $t('labels.addCondition') }}
        </button>
      </div>
    </div>

    <div class="mb-2">
      <button type="submit" class="btn btn-primary me-2" v-if="mode === 'add'" :disabled="formRule.conditions.length < 0">
        {{ $t('labels.addRule') }}
      </button>
      <button type="submit" class="btn btn-primary me-2" v-if="mode === 'edit'">
        {{ $t('labels.save') }}
      </button>
      <button
        type="button"
        class="btn btn-light"
        @click="$emit('cancel');clear()">
        {{ $t('labels.cancel') }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'RuleForm',
  emits: ['add', 'edit', 'cancel'],
  data() {
    return {
      formRule: this.rule,
      operators: ['=', '!=', '<', '>'],
    }
  },
  props: {
    rule: {
      type: Object,
      default: function () {
        return {
          name: '',
          conditions: [],
        }
      },
    },
    mode: {
      type: String,
      required: true,
      validator: function (value) {
        return ['add', 'edit'].indexOf(value) !== -1
      },
    },
  },
  methods: {
    clear() {
      this.formRule = {
        name: '',
        conditions: [],
      }
    },
  },
  watch: {
    rule: function () {
      this.formRule = this.rule
    },
  },
}
</script>

<style>
</style>
