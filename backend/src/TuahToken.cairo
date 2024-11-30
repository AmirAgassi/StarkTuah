#[starknet::contract]
mod TuahToken {
    use openzeppelin_token::erc20::{ERC20Component, ERC20HooksEmptyImpl, interface::IERC20Dispatcher, interface::IERC20DispatcherTrait};
    use starknet::{ContractAddress, get_caller_address};
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};   
    use core::array::ArrayTrait;

    component!(path: ERC20Component, storage: erc20, event: ERC20Event);

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
        usdc_address: ContractAddress,
        owner: ContractAddress
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        initial_supply: u256,
        recipient: ContractAddress,
        usdc_address: ContractAddress
    ) {
        let name = "Stark Tuah";
        let symbol = "USDTuah";

        self.erc20.initializer(name, symbol);
        self.erc20.mint(recipient, initial_supply);
        self.usdc_address.write(usdc_address);
        self.owner.write(get_caller_address());
    }

    #[external(v0)]
    fn mint(ref self: ContractState, amount: u256) {        
        // Get USDC contract address
        let usdc_address = self.usdc_address.read();
        
        // Transfer USDC from caller to this contract
        // Note: Caller must approve this contract to spend their USDC first
        let this_contract = starknet::get_contract_address();
        IERC20Dispatcher { contract_address: usdc_address }.transfer_from(
            get_caller_address(), 
            this_contract,
            amount
        );

        // Mint equivalent amount of Tuah tokens to caller
        self.erc20.mint(get_caller_address(), amount);
    }

    #[external(v0)]
    fn burn(ref self: ContractState, amount: u256) {        
        // Burn the Tuah tokens first
        self.erc20.burn(get_caller_address(), amount);
        
        // Transfer equivalent USDC back to caller
        let usdc_address = self.usdc_address.read();
        IERC20Dispatcher { contract_address: usdc_address }.transfer(
            get_caller_address(),
            amount
        );
    }

    #[external(v0)]
    fn change_usdc_address(ref self: ContractState, new_address: ContractAddress) {
        assert(get_caller_address() == self.owner.read(), 'Caller is not owner');
        self.usdc_address.write(new_address);
    }
}

