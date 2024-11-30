pub mod ekubo_interface {
    use starknet::ContractAddress;
    use core::array::Array;

    #[starknet::interface]
    pub trait IEkuboPool<TContractState> {
        fn swap(
            ref self: TContractState,
            recipient: ContractAddress,
            zero_for_one: bool,
            amount_specified: u256,
            sqrt_price_limit: u128,
            callback_address: ContractAddress,
            callback_data: Array<felt252>
        ) -> (u256, u256, u128);
    }
}
  