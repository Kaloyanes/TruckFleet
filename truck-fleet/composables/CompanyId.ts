export const useCompanyId = async () => {
  const {
    data: profile,
    promise: profilePromise,
  } = useProfileDoc()

  await profilePromise.value;

  let id = profile.value?.type === 'company' ? profile.value?.id : profile.value?.companyId;

  return ref(id)
}
