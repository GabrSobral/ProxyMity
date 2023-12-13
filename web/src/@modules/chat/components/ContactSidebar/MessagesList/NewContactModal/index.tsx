import { MagnifyingGlass, Plus } from '@phosphor-icons/react';
import { FormEvent, Fragment, useEffect, useRef, useState } from 'react';

import { Text } from '@/@design-system/Text';
import { Input } from '@/@design-system/Input';
import { Modal } from '@/@design-system/Modal';
import { Switch } from '@/@design-system/Switch';
import { Button } from '@/@design-system/Button';

import { UserApi } from '@/types/user';

import { UserItem } from './UserItem';
import { SelectedUserItem } from './SelectedUserItem';

import { useAuth } from '@/contexts/auth-context/hook';

import { getUserByEmailAsync } from '@/@modules/chat/services/getUserByEmailAsync';
import { createPrivateConversationAsync } from '@/@modules/chat/services/createPrivateConversationAsync';

interface Props {
	show: boolean;
	closeModal: () => void;
}

interface IAccountsDataState {
	selectedAccounts: UserApi[];
	account: UserApi | null;
}

export function NewContactModal({ closeModal, show }: Props) {
	const { accessToken } = useAuth();
	const inputRef = useRef<HTMLInputElement>(null);

	const [accountsData, setAccountsData] = useState<IAccountsDataState>({
		selectedAccounts: [],
		account: null,
	});

	const [errorMessage, setErrorMessage] = useState('');
	const [isGroup, setIsGroup] = useState(false);

	useEffect(() => {
		return () => {
			setAccountsData(() => ({
				account: null,
				selectedAccounts: [],
			}));
		};
	}, []);

	async function searchAccount() {
		if (!accessToken) {
			return console.error('Access Token is not defined');
		}

		if (inputRef.current?.value === '') {
			setErrorMessage('The search input can not be empty.');
			return console.error('Access Token is not defined');
		}

		setErrorMessage('');

		try {
			const account = await getUserByEmailAsync({ userEmail: inputRef.current?.value || '' }, { accessToken });

			setAccountsData(state => ({ ...state, account: account }));
		} catch (error: any) {
			console.error(error);
			setAccountsData(state => ({ ...state, account: null }));

			setErrorMessage(error?.response?.data?.error || error.message);
		}
	}

	function addAccount(newAccount: UserApi) {
		if (accountsData.selectedAccounts.some(item => item.id === newAccount.id)) {
			setAccountsData(state => ({ ...state, account: null }));
			return console.warn('This account is already selected. Try another one.');
		}

		setAccountsData(state => ({ account: null, selectedAccounts: [newAccount, ...state.selectedAccounts] }));
	}

	function removeAccount(account: UserApi) {
		setAccountsData(state => ({
			...state,
			selectedAccounts: state.selectedAccounts.filter(item => item.id !== account.id),
		}));
	}

	async function createConversationSubmit(e: FormEvent) {
		e.preventDefault();

		if (!accessToken) {
			return console.error('Access Token is not defined');
		}

		await createPrivateConversationAsync({ participantId: '' }, { accessToken });
	}

	return (
		<Modal show={show} closeModal={closeModal} className="w-[30rem] gap-4">
			<Modal.Title>Create a new conversation</Modal.Title>

			<Modal.Description>Search for a contact to create a conversation.</Modal.Description>

			<form className="flex flex-col gap-4" onSubmit={createConversationSubmit}>
				<fieldset className="flex gap-4">
					<Input.Group>
						<Input.Label>Search e-mail</Input.Label>

						<Input type="email" placeholder="E.g: john_doe@email.com" inputRef={inputRef} />

						{errorMessage && <Input.ErrorMessage>{errorMessage}</Input.ErrorMessage>}
					</Input.Group>

					<Button type="button" className="mt-8 h-[3.5rem]" title="Search user" onClick={searchAccount}>
						<MagnifyingGlass color="white" size={24} />
					</Button>
				</fieldset>

				<Text
					size="lg"
					className="flex gap-4 cursor-pointer items-center w-fit"
					onClick={() => setIsGroup(state => !state)}
				>
					<Fragment>
						<Switch checked={isGroup} />
						Is a group?
						{isGroup ? (
							<Text size="md" className="text-green-500 dark:text-green-500">
								Yes
							</Text>
						) : (
							<Text size="md" className="text-red-500 dark:text-red-500">
								No
							</Text>
						)}
					</Fragment>
				</Text>

				{accountsData.account && (
					<UserItem
						user={accountsData.account}
						key={accountsData.account.id}
						addAccount={() => accountsData.account && addAccount(accountsData.account)}
					/>
				)}

				<ul className="flex flex-col gap-3">
					{accountsData.selectedAccounts.map(account => (
						<SelectedUserItem user={account} isSelected key={account.id} removeAccount={() => removeAccount(account)} />
					))}
				</ul>

				<Button type="submit" className="w-full">
					<Plus color="white" size={24} />
					Create conversation
				</Button>
			</form>
		</Modal>
	);
}
