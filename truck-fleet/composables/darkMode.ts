export const useDarkMode = () => {
  const darkMode = useState('darkMode', () => false);

  return ref(
    {
      darkMode: darkMode.value,
      toggleDarkMode: () => {
        darkMode.value = !darkMode
      }
    }
  )
}
