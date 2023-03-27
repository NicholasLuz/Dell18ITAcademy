import { useEffect, useState } from 'react'

function ReadCSV() {
  const [ csv, setCsv] = useState([]);
  useEffect(() => {
    fetch('DNIT-Distancias.csv')
    .then(response => response.text())
    .then(text => {
      const row = text.split('\n')
      const cities = row[0].split(';')
      const distance = row.slice(1).map(row => row.split(';'))

    })
  },[])
}