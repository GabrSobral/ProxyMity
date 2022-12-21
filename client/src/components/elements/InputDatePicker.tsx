import { forwardRef, useState, Fragment, InputHTMLAttributes } from 'react';
import ReactDatePicker, {
	ReactDatePickerProps,
	ReactDatePickerCustomHeaderProps,
	registerLocale,
} from 'react-datepicker';
import { Calendar, ChevronLeft, ChevronRight } from 'react-feather';
import ptBR from 'date-fns/locale/pt-BR';

registerLocale('pt-BR', ptBR);

import { Input } from './Input';

interface InputDatePicker extends ReactDatePickerProps {
	label: string;
	onChange: (date: Date | null) => void;
	showYearPicker?: boolean;
	showMonthYearPicker?: boolean;
	showQuarterYearPicker?: boolean;
	canChangeTypePickerDynamically?: boolean;
}

const months = [
	'Janeiro',
	'Fevereiro',
	'Março',
	'Abril',
	'Maio',
	'Junho',
	'Julho',
	'Agosto',
	'Setembro',
	'Outubro',
	'Novembro',
	'Dezembro',
];

interface IConfig {
	isDayPicker: boolean;
	isMonthPicker: boolean;
	isYearPicker: boolean;
	isQuarterPicker: boolean;
}

export function InputDatePicker({
	label,
	onChange,
	showYearPicker = false,
	showMonthYearPicker = false,
	showQuarterYearPicker = false,
	canChangeTypePickerDynamically = false,
	...rest
}: InputDatePicker) {
	const [config, setConfig] = useState<IConfig>({
		isDayPicker: !showYearPicker && !showMonthYearPicker && !showQuarterYearPicker,
		isMonthPicker: showMonthYearPicker,
		isYearPicker: showYearPicker,
		isQuarterPicker: showQuarterYearPicker,
	});

	const DateInput = forwardRef<HTMLInputElement>((props: InputHTMLAttributes<HTMLInputElement>, ref) => {
		return ref ? (
			<Input.Group>
				<Input.Label htmlFor={props.id}>{label}</Input.Label>

				<Input.InputWrapper className="w-[10rem]">
					<Input
						{...props}
						type="text"
					/>

					<Calendar
						className="pointer-events-none text-gray-700 dark:text-whiteAlpha-900 absolute top-2/4 right-3 translate-y-[-50%]"
						size={18}
					/>
				</Input.InputWrapper>
			</Input.Group>
		) : null;
	});
	DateInput.displayName = 'DateInput';

	function handleType(type: 'year' | 'month' | 'day' | 'quarter') {
		setConfig({
			isDayPicker: type === 'day',
			isYearPicker: type === 'year',
			isMonthPicker: type === 'month',
			isQuarterPicker: type === 'quarter',
		});
	}

	function Header({ props }: { props: ReactDatePickerCustomHeaderProps }) {
		const { date, decreaseMonth, increaseMonth, nextMonthButtonDisabled, prevMonthButtonDisabled } = props;

		return (
			<div className="flex justify-between px-2 py-1 bg-white dark:bg-gray-900 dark:text-white text-gray-700 mb-2">
				<div className="flex items-center gap-2">
					{canChangeTypePickerDynamically ? (
						<Fragment>
							<button
								type="button"
								onClick={() => (!config.isMonthPicker ? handleType('month') : handleType('day'))}
								className="font-bold font-sans text-gray-700 dark:text-whiteAlpha-900 text-sm hover:underline"
							>
								{months[date.getMonth()]}
							</button>
							<button
								type="button"
								onClick={() => (!config.isYearPicker ? handleType('year') : handleType('day'))}
								className="font-bold font-sans text-gray-700 dark:text-whiteAlpha-900 text-sm hover:underline"
							>
								{date.getFullYear()}
							</button>
						</Fragment>
					) : (
						<Fragment>
							<span className="font-bold font-sans text-gray-700 dark:text-whiteAlpha-900 text-sm">
								{months[date.getMonth()]}
							</span>
							<span className="font-bold font-sans text-gray-700 dark:text-whiteAlpha-900 text-sm">
								{date.getFullYear()}
							</span>
						</Fragment>
					)}
				</div>

				{config.isDayPicker && (
					<nav className="flex items-center gap-1">
						<button
							onClick={decreaseMonth}
							disabled={prevMonthButtonDisabled}
							aria-label="Mês anterior"
							title={prevMonthButtonDisabled ? '' : 'Mês anterior'}
							className="disabled:cursor-not-allowed disabled:opacity-40"
						>
							<ChevronLeft
								size={18}
								className="text-gray-400"
							/>
						</button>

						<button
							onClick={increaseMonth}
							disabled={nextMonthButtonDisabled}
							aria-label="Próximo mês"
							title={nextMonthButtonDisabled ? '' : 'Próximo mês'}
							className="disabled:cursor-not-allowed disabled:opacity-40"
						>
							<ChevronRight
								size={18}
								className="text-gray-400"
							/>
						</button>
					</nav>
				)}
			</div>
		);
	}
	function MonthHeader({ props }: { props: ReactDatePickerCustomHeaderProps }) {
		const { date, decreaseYear, increaseYear, nextMonthButtonDisabled, prevMonthButtonDisabled } = props;

		return (
			<div className="flex justify-between px-2 py-1 bg-white dark:bg-gray-900 dark:text-white text-gray-700 mb-2">
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => (!config.isMonthPicker ? handleType('month') : handleType('day'))}
						className="font-bold font-sans text-gray-700 dark:text-whiteAlpha-900 text-sm hover:underline"
					>
						{months[date.getMonth()]}
					</button>
					<button
						type="button"
						onClick={() => (!config.isYearPicker ? handleType('year') : handleType('day'))}
						className="font-bold font-sans text-gray-700 dark:text-whiteAlpha-900 text-sm hover:underline"
					>
						{date.getFullYear()}
					</button>
				</div>

				<nav className="flex items-center gap-1">
					<button
						onClick={decreaseYear}
						disabled={prevMonthButtonDisabled}
						aria-label="Ano anterior"
						title={prevMonthButtonDisabled ? '' : 'Mês anterior'}
						className="disabled:cursor-not-allowed disabled:opacity-40"
					>
						<ChevronLeft
							size={18}
							className="text-gray-400"
						/>
					</button>

					<button
						onClick={increaseYear}
						disabled={nextMonthButtonDisabled}
						aria-label="Próximo ano"
						title={nextMonthButtonDisabled ? '' : 'Próximo mês'}
						className="disabled:cursor-not-allowed disabled:opacity-40"
					>
						<ChevronRight
							size={18}
							className="text-gray-400"
						/>
					</button>
				</nav>
			</div>
		);
	}
	function YearHeader({ props }: { props: ReactDatePickerCustomHeaderProps }) {
		const { date, changeYear } = props;

		const initialCurrentDateRange = Math.floor((date.getFullYear() - 1) / 12) * 12 + 1;
		const finalCurrentDateRange = Math.floor((date.getFullYear() - 1) / 12) * 12 + 12;

		return (
			<div className="flex justify-between px-2 py-1 bg-white dark:bg-gray-900 dark:text-white text-gray-700 mb-2">
				<div className="flex items-center gap-2">
					{canChangeTypePickerDynamically ? (
						<button
							type="button"
							onClick={() => (!config.isMonthPicker ? handleType('month') : handleType('day'))}
							className="font-bold font-sans text-gray-700 dark:text-whiteAlpha-900 text-sm hover:underline"
						>
							{initialCurrentDateRange + '-' + finalCurrentDateRange}
						</button>
					) : (
						<span className="font-bold font-sans text-gray-700 dark:text-whiteAlpha-900 text-sm">
							{initialCurrentDateRange + '-' + finalCurrentDateRange}
						</span>
					)}
				</div>

				<nav className="flex items-center gap-1">
					<button
						onClick={() => changeYear(date.getFullYear() - 12)}
						aria-label="Ano anterior"
						title="Ano anterior"
						className="disabled:cursor-not-allowed disabled:opacity-40"
					>
						<ChevronLeft
							size={18}
							className="text-gray-400"
						/>
					</button>

					<button
						onClick={() => changeYear(date.getFullYear() + 12)}
						aria-label="Próximo ano"
						title="Próximo ano"
						className="disabled:cursor-not-allowed disabled:opacity-40"
					>
						<ChevronRight
							size={18}
							className="text-gray-400"
						/>
					</button>
				</nav>
			</div>
		);
	}
	function QuarterHeader({ props }: { props: ReactDatePickerCustomHeaderProps }) {
		const { date, increaseYear, decreaseYear } = props;

		return (
			<div className="flex justify-between px-2 py-1 bg-white dark:bg-gray-900 dark:text-white text-gray-700 mb-2">
				<div className="flex items-center gap-2">
					{canChangeTypePickerDynamically ? (
						<button
							type="button"
							onClick={() => (!config.isMonthPicker ? handleType('month') : handleType('day'))}
							className="font-bold font-sans text-gray-700 dark:text-whiteAlpha-900 text-sm hover:underline"
						>
							{date.getFullYear()}
						</button>
					) : (
						<span className="font-bold font-sans text-gray-700 dark:text-whiteAlpha-900 text-sm">
							{date.getFullYear()}
						</span>
					)}
				</div>

				<nav className="flex items-center gap-1">
					<button
						onClick={decreaseYear}
						aria-label="Mês anterior"
						title=""
						className="disabled:cursor-not-allowed disabled:opacity-40"
					>
						<ChevronLeft
							size={18}
							className="text-gray-400"
						/>
					</button>

					<button
						onClick={increaseYear}
						aria-label="Próximo mês"
						title=""
						className="disabled:cursor-not-allowed disabled:opacity-40"
					>
						<ChevronRight
							size={18}
							className="text-gray-400"
						/>
					</button>
				</nav>
			</div>
		);
	}

	function onChangeMonth(month: Date | null) {
		if (!config.isMonthPicker || !month) return;

		onChange(month);
		if (canChangeTypePickerDynamically)
			setConfig({
				isDayPicker: true,
				isMonthPicker: false,
				isYearPicker: false,
				isQuarterPicker: false,
			});
	}
	function onChangeYear(year: Date | null) {
		if (!config.isYearPicker || !year) return;

		onChange(year);
		if (canChangeTypePickerDynamically)
			setConfig({
				isDayPicker: false,
				isMonthPicker: true,
				isYearPicker: false,
				isQuarterPicker: false,
			});
	}
	function onChangeQuarter(quarter: Date | null) {
		if (!config.isQuarterPicker || !quarter) return;

		onChange(quarter);
		if (canChangeTypePickerDynamically)
			setConfig({
				isDayPicker: true,
				isMonthPicker: false,
				isYearPicker: false,
				isQuarterPicker: false,
			});
	}

	return (
		<div>
			<ReactDatePicker
				locale="pt-BR"
				showPopperArrow={false}
				showYearPicker={config.isYearPicker}
				showMonthYearPicker={config.isMonthPicker}
				showQuarterYearPicker={config.isQuarterPicker}
				shouldCloseOnSelect={!(config.isMonthPicker || config.isYearPicker)}
				customInput={<DateInput />}
				formatWeekDay={weekday => `${weekday.substring(0, 1).toUpperCase()}`}
				dateFormat="PP"
				onChange={date =>
					config.isMonthPicker
						? onChangeMonth(date)
						: config.isYearPicker
						? onChangeYear(date)
						: config.isDayPicker
						? onChange(date)
						: config.isQuarterPicker && onChangeQuarter(date)
				}
				renderDayContents={(day, date) => (
					<div
						className="flex-1 w-9 h-9 flex items-center justify-center"
						title={date?.toLocaleDateString()}
					>
						<span className="dark:text-whiteAlpha-900 text-gray-700">{day}</span>
					</div>
				)}
				onCalendarClose={() =>
					setConfig({
						isDayPicker: !showYearPicker && !showMonthYearPicker && !showQuarterYearPicker,
						isMonthPicker: showMonthYearPicker,
						isYearPicker: showYearPicker,
						isQuarterPicker: showQuarterYearPicker,
					})
				}
				renderCustomHeader={props =>
					config.isDayPicker ? (
						<Header props={props} />
					) : config.isMonthPicker ? (
						<MonthHeader props={props} />
					) : config.isYearPicker ? (
						<YearHeader props={props} />
					) : (
						config.isQuarterPicker && <QuarterHeader props={props} />
					)
				}
				{...rest}
			/>
		</div>
	);
}
