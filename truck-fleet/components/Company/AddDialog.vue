<script setup>
const isModalOpen = useState('addCompanyModal', () => false)
const isAddOrderOpen = useState('addOrder');


</script>

<template>
  <!-- <UButton @click="open" variant="soft" class="flex-1 flex justify-center self-center">Add
    Company
  </UButton> -->

  <Sheet :open="isModalOpen" @update:open="(e) => isModalOpen = e">
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
            <UButton variant="soft" class="flex-1 flex justify-center">Close</UButton>
          </SheetClose>
          <SheetClose as-child>
            <UButton @click="addCompany" class="flex-1 flex justify-center">Add Company</UButton>
          </SheetClose>
        </div>

      </div>
    </SheetContent>
  </Sheet>
</template>
