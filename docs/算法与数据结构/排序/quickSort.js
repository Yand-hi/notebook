function quickSort(array) {
    if (array.length <= 1) return array;
    const [pivot, ...rest] = array;
    const small = rest.filter(i => i <= pivot);
    const large = rest.filter(i => i > pivot);
    return [...quickSort(small), pivot, ...quickSort(large)]
  }
  
  const result = quickSort([3, 4, 4, 6, 1, 6, 8, 2, 3, 5]);
  console.log(result);