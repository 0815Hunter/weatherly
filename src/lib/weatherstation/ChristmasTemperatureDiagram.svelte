<script lang="ts">
	import Autocomplete from '@smui-extra/autocomplete';
	import { Text } from '@smui/list';
	import CircularProgress from '@smui/circular-progress';
	import { Cell } from '@smui/layout-grid';
	import LayoutGrid from '@smui/layout-grid';
	import type { City } from './City';
	import type { WeatherStation } from './WeatherStation';
	import { ClimateDay, type ClimateDayDto } from './ClimateDay';
	import Chart from 'svelte-frappe-charts';

	let city: City | undefined = undefined;
	let weatherStation: WeatherStation | undefined = undefined;
	let christmasClimates: Array<ClimateDay> = [];

	let chartData: any;
	$: {
		let christmasClimatesToAssign: Array<ClimateDay>;
		if (christmasClimates.length > 50) {
			christmasClimatesToAssign = christmasClimates.slice(-50);
		} else {
			christmasClimatesToAssign = christmasClimates;
		}

		chartData = {
			labels: christmasClimatesToAssign.map(
				(climate) => `\'${climate.measureDate.getFullYear().toString().substring(2, 4)}`
			),
			datasets: [{ values: christmasClimatesToAssign.map((climate) => climate.meanTemperature) }]
		};
	}

	$: searchNearestWeatherStation(city).then(
		(foundWeatherStation) => (weatherStation = foundWeatherStation)
	);
	$: fetchChristmasClimates(weatherStation).then(
		(fetchedChristmasClimates) => (christmasClimates = fetchedChristmasClimates)
	);

	async function searchCities(input: string) {
		if (input === '') {
			return new Array<City>();
		}

		const response = await fetch(`/api/cities?name-like=${input}`, {
			method: 'GET'
		});

		const cities = (await response.json()) as Array<City>;

		console.log(cities);

		return cities;
	}

	async function searchNearestWeatherStation(city: City | undefined) {
		if (city === undefined) {
			return undefined;
		}

		const geoLocation = city.geoLocation;

		const response = await fetch(`/api/weather/?lat=${geoLocation.lat}&long=${geoLocation.long}`, {
			method: 'GET'
		});

		const weatherStation = (await response.json()) as WeatherStation;

		console.log(weatherStation);

		return weatherStation;
	}

	async function fetchChristmasClimates(weatherStation: WeatherStation | undefined) {
		if (weatherStation === undefined) {
			return new Array<ClimateDay>();
		}

		const response = await fetch(`/api/weather/${weatherStation.stationId}/christmas`, {
			method: 'GET'
		});

		const climateDayDtos = (await response.json()) as Array<ClimateDayDto>;

		christmasClimates = climateDayDtos.map(ClimateDay.fromClimateDayDto);

		console.log(christmasClimates);

		return christmasClimates;
	}

	let chartRef: any;
	const onExport = () => chartRef.exportChart();
</script>

<LayoutGrid>
	<Cell span={12}>
		<h1>Weihnachten: Temperatur in ºC</h1>
	</Cell>
	<Cell span={2}>
		<Autocomplete
			selectOnExactMatch={true}
			search={searchCities}
			bind:value={city}
			showMenuWithNoInput={false}
			label="Stadt"
			getOptionLabel={(option) => (option ? option.name : '')}
			text="Heidelberg"
		>
			<Text
				slot="loading"
				style="display: flex; width: 100%; justify-content: center; align-items: center;"
			>
				<CircularProgress style="height: 24px; width: 24px;" indeterminate />
			</Text>
		</Autocomplete>
	</Cell>
	<Cell span={10} />
	<Cell span={3}>
		<button on:click={onExport}>Export</button>
	</Cell>
	<Cell span={12}>
		<Chart data={chartData} type="line" bind:this={chartRef} />
	</Cell>
</LayoutGrid>
