export interface WeatherStation {
	stationId: Number;
	stationName: String;
	fromDate: Date;
	toDate: Date;
	geoLocation: {
		lat: Number;
		long: Number;
	};
}
