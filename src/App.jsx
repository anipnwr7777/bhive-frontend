import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Register from './Register';
import Login from './Login';
import {
	Container,
	Typography,
	Grid,
	Card,
	CardContent,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Button,
	FormHelperText,
} from '@mui/material';

// List of fund houses to be used in the dropdown
const FUND_HOUSES = [
	'Aditya Birla Sun Life Mutual Fund',
	'Axis Mutual Fund',
	'Bajaj Finserv Mutual Fund',
	'Bandhan Mutual Fund',
	'Baroda BNP Paribas Mutual Fund',
	'Canara Robeco Mutual Fund',
	'DSP Mutual Fund',
	'Franklin Templeton Mutual Fund',
	'HDFC Mutual Fund',
	'HSBC Mutual Fund',
	'ICICI Prudential Mutual Fund',
	'Invesco Mutual Fund',
	'ITI Mutual Fund',
	'Kotak Mahindra Mutual Fund',
	'LIC Mutual Fund',
	'Mirae Asset Mutual Fund',
	'Nippon India Mutual Fund',
	'SBI Mutual Fund',
	'Sundaram Mutual Fund',
	'Trust Mutual Fund',
	'UTI Mutual Fund',
	'PGIM India Mutual Fund',
	'Tata Mutual Fund',
	'Union Mutual Fund',
	'Bank of India Mutual Fund',
	'360 ONE Mutual Fund (Formerly Known as IIFL Mutual Fund)',
	'Groww Mutual Fund',
	'JM Financial Mutual Fund',
	'Mahindra Manulife Mutual Fund',
	'Quantum Mutual Fund',
	'quant Mutual Fund',
	'Edelweiss Mutual Fund',
	'Motilal Oswal Mutual Fund',
	'Navi Mutual Fund',
	'PPFAS Mutual Fund',
	'WhiteOak Capital Mutual Fund',
	'Helios Mutual Fund',
	'NJ Mutual Fund',
	'Samco Mutual Fund',
	'Shriram Mutual Fund',
	'Taurus Mutual Fund',
	'Zerodha Mutual Fund',
	'Old Bridge Mutual Fund',
];


export default function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isRegistered, setIsRegistered] = useState(false)

	const [userId, setUserId] = useState('')

	useEffect(() => {
		const token = localStorage.getItem('authToken');
		const userId = localStorage.getItem('userId');
		setUserId(userId)
		if (token) {
			setIsLoggedIn(true);
			axios.defaults.headers['Authorization'] = `Bearer ${token}`;
		}
	}, [isLoggedIn, isRegistered]);

	const handleLoginSuccess = () => {
		setIsLoggedIn(true);
	};

	const handleRegisterSuccess = () => {
		setIsRegistered(true);
	};

	return (
		<div>
			{userId ? (
				<PortfolioApp userId={userId} />
			) : (
				<div>
					{!isRegistered ? (
						<div>
							<Register onRegisterSuccess={handleRegisterSuccess} />
							<button onClick={() => setIsRegistered(true)}>
								Already have an account? Login
							</button>
						</div>
					) : (
						<div>
							<Login onLoginSuccess={handleLoginSuccess} />
							<button onClick={() => setIsRegistered(false)}>
								Don't have an account? Register
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);

}


function PortfolioApp({ userId }) {
	const [portfolio, setPortfolio] = useState([]);
	const [selectedFundHouse, setSelectedFundHouse] = useState('');
	const [schemes, setSchemes] = useState([]);
	const [selectedScheme, setSelectedScheme] = useState('');
	const [investmentAmount, setInvestmentAmount] = useState('');

	useEffect(() => {
		fetchPortfolio();
	}, []);

	const fetchPortfolio = async () => {
		try {
			const response = await axios.get(`${import.meta.env.VITE_API_AP}/users/${userId}/portfolio`);
			setPortfolio(response.data);
		} catch (err) {
			console.error('Error fetching portfolio:', err);
		}
	};

	const handleFundHouseChange = async (e) => {
		const fundHouse = e.target.value;
		setSelectedFundHouse(fundHouse);
		setSchemes([]);
		setSelectedScheme('');

		if (!fundHouse) return;

		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_AP}/schemes?fund_house=${encodeURIComponent(fundHouse)}`
			);
			setSchemes(response.data || []);
		} catch (err) {
			console.error('Error fetching schemes:', err);
		}
	};

	const createInvestment = async () => {
		if (!selectedScheme || !investmentAmount) {
			alert('Please select a scheme and enter an investment amount.');
			return;
		}

		try {
			await axios.post(`${import.meta.env.VITE_API_AP}/users/${userId}/investment`, {
				scheme_code: selectedScheme,
				investment_amount: parseFloat(investmentAmount),
			});

			fetchPortfolio();
			setSelectedFundHouse('');
			setSelectedScheme('');
			setInvestmentAmount('');
			setSchemes([]);
		} catch (err) {
			console.error('Error creating investment:', err);
		}
	};

	const getColor = (currentNav, purchaseNav) => {
		return currentNav >= purchaseNav ? 'lightgreen' : 'lightcoral';
	};

	return (
		<Container maxWidth="md" sx={{ paddingTop: '2rem' }}>
			<Typography variant="h5" gutterBottom>
				Add New Investment
			</Typography>

			{/* Select Fund House */}
			<FormControl fullWidth sx={{ marginBottom: '1rem' }}>
				<InputLabel>Fund House</InputLabel>
				<Select value={selectedFundHouse} onChange={handleFundHouseChange} label="Fund House">
					<MenuItem value="">
						<em>-- Select Fund House --</em>
					</MenuItem>
					{FUND_HOUSES.map((house) => (
						<MenuItem key={house} value={house}>
							{house}
						</MenuItem>
					))}
				</Select>
				<FormHelperText>Select a fund house to proceed</FormHelperText>
			</FormControl>

			{/* Choose Scheme */}
			{schemes && (
				<FormControl fullWidth sx={{ marginBottom: '1rem' }}>
					<InputLabel>Scheme</InputLabel>
					<Select value={selectedScheme} onChange={(e) => setSelectedScheme(e.target.value)} label="Scheme">
						<MenuItem value="">
							<em>-- Select Scheme --</em>
						</MenuItem>
						{schemes.map((scheme) => (
							<MenuItem key={scheme.Scheme_Code} value={scheme.Scheme_Code}>
								{scheme.Scheme_Name}
							</MenuItem>
						))}
					</Select>
					<FormHelperText>Select a scheme to invest in</FormHelperText>
				</FormControl>
			)}

			{/* Investment Amount */}
			<TextField
				label="Investment Amount"
				type="number"
				value={investmentAmount}
				onChange={(e) => setInvestmentAmount(e.target.value)}
				fullWidth
				sx={{ marginBottom: '1rem' }}
				inputProps={{ min: 0 }}
			/>

			{/* Create Investment Button */}
			<Button variant="contained" color="primary" onClick={createInvestment} fullWidth>
				Create Investment
			</Button>

			<hr />

			<Typography variant="h4" gutterBottom>
				My Portfolio
			</Typography>
			{Object.keys(portfolio).length > 0 ? (
				<Grid container spacing={2}>
					{Object.keys(portfolio).map((key) => {
						if (key == "user_id") return
						const inv = portfolio[key];
						const profitOrLoss = inv.currentNav - inv.purchaseNav;
						const color = getColor(inv.currentNav, inv.purchaseNav);
						return (
							<Grid item xs={12} sm={6} md={4} key={key}>
								<Card sx={{ backgroundColor: color, padding: '1rem' }}>
									<CardContent>
										<Typography variant="h6">Scheme Code: {key}</Typography>
										<Typography variant="body1">
											Purchase NAV: <strong>{inv.purchaseNav}</strong>
										</Typography>
										<Typography variant="body1">
											Current NAV: <strong>{inv.currentNav}</strong>
										</Typography>
										<Typography variant="body1">
											Profit/Loss: <strong>{profitOrLoss.toFixed(2)}</strong>
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						);
					})}
				</Grid>
			) : (
				<Typography variant="body1">No investments found.</Typography>
			)}
		</Container>
	);
}






