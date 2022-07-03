<script setup lang="ts">
import { useAccount, useEnsName } from 'vagmi';
import { watch } from 'vue';

const { address } = useAccount();
const { data: ensNameData } = useEnsName({ address });

watch(address, (val) => {
  console.log('Account data', val);
});
</script>

<template>
  <div>
    {{ ensNameData ?? address }}
    {{ ensNameData ? ` (${address})` : null }}
  </div>
</template>
