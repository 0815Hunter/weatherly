export class ClimateDay {
	measureDate: Date;
	meanTemperature: Number;

	constructor(measureDate: Date, meanTemperature: Number) {
		this.measureDate = measureDate;
		this.meanTemperature = meanTemperature;
	}

	public static fromClimateDayDto(climateDayDto: ClimateDayDto) {
		const measureDate = new Date(Date.parse(climateDayDto.measureDate));
		return new ClimateDay(measureDate, climateDayDto.meanTemperature);
	}
}

export interface ClimateDayDto {
	measureDate: string;
	meanTemperature: Number;
}
