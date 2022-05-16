<script setup lang="ts">
import { useAccount, useEnsName } from 'vagmi'
import { computed } from 'vue'

const { data: accountData } = useAccount()
const address = computed(() => accountData.value?.address)
const { data: ensNameData } = useEnsName({ address })
</script>

<template>
  <div>
    {{ ensNameData ?? accountData?.address }}
    {{ ensNameData ? ` (${accountData?.address})` : null }}
  </div>
</template>
