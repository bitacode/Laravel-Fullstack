<?php

namespace App\Filament\Resources;

use App\Filament\Resources\VoucherResource\Pages;
use App\Filament\Resources\VoucherResource\RelationManagers;
use App\Models\Voucher;
use Filament\Forms;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\DatePicker;
use Filament\Tables\Columns\TextColumn;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Auth;

class VoucherResource extends Resource
{
    protected static ?string $model = Voucher::class;

    protected static ?string $navigationIcon = 'heroicon-o-ticket';

    public static function canAccess(): bool
    {
        return Auth::user()?->apiKey?->role === 'admin';
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                ->label("Voucher's Name")
                ->columnSpan(2)
                ->required()
                ->maxLength(255),
                
                Select::make('discount_type')
                ->label('Discount Type')
                ->options([
                    'percentage' => 'Percentage',
                    'fixed' => 'Fixed'
                    ])
                    ->required(),
                    
                TextInput::make('unique_code')
                ->label('Unique Code')
                ->required()
                ->maxLength(255),
                
                
                TextInput::make('discount_value')
                ->label('Discount Value')
                ->required()
                ->numeric(),
                
                TextInput::make('min_eligible_price')
                ->label('Min. Eligible Price')
                ->helperText('Offices that have a price equal to or less than the minimum eligible price that has been set will not be affected by the discount.')
                ->required()
                ->numeric(),
                
                DatePicker::make('valid_from')
                ->label('Valid From')
                ->required(),
                
                DatePicker::make('valid_until')
                ->label('Valid Until')
                ->required()
                
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                ->searchable(),

                TextColumn::make('unique_code')
                ->searchable(),

                TextColumn::make('usage_limit'),

                TextColumn::make('usage_count'),

                TextColumn::make('valid_from')
                ->date(),

                TextColumn::make('valid_until')
                ->date(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListVouchers::route('/'),
            'create' => Pages\CreateVoucher::route('/create'),
            'edit' => Pages\EditVoucher::route('/{record}/edit'),
        ];
    }
}
