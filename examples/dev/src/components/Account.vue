<script setup lang="ts">
import { useAccount, useEnsName } from 'vagmi';
import { computed, watch } from 'vue';

const { data: accountData } = useAccount();
const address = computed(() => accountData.value?.address);
const { data: ensNameData } = useEnsName({ address });

watch(accountData, (val) => {
  console.log('Account data', val);
});
</script>

<template>
  <div>
    {{ ensNameData ?? accountData?.address }}
    {{ ensNameData ? ` (${accountData?.address})` : null }}
  </div>
</template>
