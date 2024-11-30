#[starknet::contract]
mod TuahToken {
    use openzeppelin_token::erc20::{ERC20Component, ERC20HooksEmptyImpl, interface::IERC20Dispatcher, interface::IERC20DispatcherTrait};
    use starknet::{ContractAddress, get_caller_address};
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};   
    use core::array::ArrayTrait;
    use crate::ekubo_interface::ekubo_interface::{IEkuboPool, IEkuboPoolDispatcher, IEkuboPoolDispatcherTrait};

    component!(path: ERC20Component, storage: erc20, event: ERC20Event);

    // ERC20 Mixin
    #[abi(embed_v0)]
    impl ERC20MixinImpl = ERC20Component::ERC20MixinImpl<ContractState>;
    impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;

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
        recipient: ContractAddress,
        usdc_address: ContractAddress
    ) {
        let name = "Stark Tuah";
        let symbol = "STUAH";

        self.erc20.initializer(name, symbol);
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

    #[external(v0)]
    fn swap_usdc_for_eth(
        ref self: ContractState,
        ekubo_pool: ContractAddress,
        amount_in: u256,
        min_amount_out: u256
    ) {
        // get the usdc address
        let usdc_address = self.usdc_address.read();
        
        // approve ekubo to spend our usdc
        IERC20Dispatcher { contract_address: usdc_address }.approve(ekubo_pool, amount_in);
        
        // perform the swap using the dispatcher
        let ekubo = IEkuboPoolDispatcher { contract_address: ekubo_pool };
        let (amount0, _amount1, _sqrt_price) = ekubo.swap(
            get_caller_address(), // recipient
            true, // zero_for_one (USDC -> ETH direction)
            amount_in,
            0_u128, // no price limit
            starknet::contract_address_const::<0>(), // no callback
            ArrayTrait::new() // no callback data
        );

        // verify minimum amount received
        assert(amount0 >= min_amount_out, 'insufficient output amount');
    }
}

