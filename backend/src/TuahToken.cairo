#[starknet::contract]
mod TuahToken {
    use openzeppelin_token::erc20::{ERC20Component, ERC20HooksEmptyImpl};
    use starknet::{ContractAddress, get_caller_address};
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess};
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};   

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

        self.erc20.mint(get_caller_address(), amount);
    }

    #[external(v0)]
    fn burn(ref self: ContractState, amount: u256) {
        self.erc20.burn(get_caller_address(), amount);
    }

    #[external(v0)]
    fn change_usdc_address(ref self: ContractState, new_address: ContractAddress) {
        assert(get_caller_address() == self.owner.read(), 'Caller is not owner');
        self.usdc_address.write(new_address);
    }
}

