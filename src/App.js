import React, { useEffect, useState } from 'react';
import './App.css';
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core"

// Import components
import InfoBox from "./components/InfoBox";
import Table from "./components/Table";
import {sortData} from "./components/util";
import LineGraph from './components/LineGraph';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('global');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  // 
  useEffect(() => { 
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);


  // Fetching Countries from https://disease.sh/v3/covid-19/countries
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso3,
          }));

          const sortedData =sortData (data);
          setTableData(sortedData);
          setCountries(countries);
          console.log("Countries", countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    // Fetching Global Data from https://disease.sh/v3/covid-19/all
    // Fetching data of a Country from https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
    const url = countryCode === "global"
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
      }, []);
  };
  console.log('CountryInfo', countryInfo)



  return (
    <div className="app">
      <div className='app__left'>

        {/* Header */}
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>

          {/* Title + Select Input dropdown field */}
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="global"><h5>Global</h5></MenuItem>
              {/*Loop Thorugh all the Countries*/}
              {countries.map((country) => (
                <MenuItem value={country.value}><h5>{country.name}</h5></MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        { /*InfoBoxes*/}
        <div className="app__stats">
          <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>
        <div className="app__graph">
          <br />
          <br />
          {/* Graph */}
          <h3>New Cases Graph</h3>
          <LineGraph casesType="cases"/>
        </div>
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases Table (Countrywise) </h3>
          <Table countries={tableData}></Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
