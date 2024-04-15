<script setup>
const isModalOpen = computed(() => {
  return useRoute().hash == "#addCompany";
});


</script>

<template>
  <Sheet :open="isModalOpen" @update:open="(e) => useRouter().back()">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Add Company</SheetTitle>
      </SheetHeader>
      <div class="flex flex-col gap-3">
        <UInput v-model="companyName" placeholder="Company Name" />
        <UInput v-model="companyAddress" placeholder="Company Address" />
        <UInput v-model="companyPhone" placeholder="Company Phone" />
        <UInput v-model="companyEmail" placeholder="Company Email" />

        <div class="sticky bottom-3 flex justify-evenly px-8 gap-3 pt-5 ">

          <SheetClose as-child>
            <Button variant="soft" class="flex-1 flex justify-center">Close</Button>
          </SheetClose>
          <SheetClose as-child>
            <Button @click="addCompany" class="flex-1 flex justify-center">Add Company</Button>
          </SheetClose>
        </div>

      </div>
    </SheetContent>
  </Sheet>
</template>
