<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RegistrationResource\Pages;
use App\Filament\Resources\RegistrationResource\RelationManagers;
use App\Models\Registration;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\DatePicker;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class RegistrationResource extends Resource
{
    protected static ?string $model = Registration::class;

    protected static ?string $navigationIcon = 'heroicon-o-list-bullet';

    public static function canAccess(): bool
    {
        return Auth::user()?->apiKey?->role === 'admin';
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                ->label('Company Name')
                ->dehydrated(false)
                ->readOnly(),

                TextInput::make('email')
                ->label('Company Email')
                ->dehydrated(false)
                ->readOnly(),

                TextInput::make('password')
                ->label('Company Password')
                ->password()
                ->required()
                ->dehydrateStateUsing(fn (string $state) => Hash::make($state)),

                TextInput::make('bank_name_primary')
                ->label('First Company Bank')
                ->dehydrated(false)
                ->readOnly(),

                TextInput::make('bank_name_secondary')
                ->label('Second Company Bank')
                ->dehydrated(false)
                ->readOnly(),

                TextInput::make('bank_account_primary')
                ->label('First Bank Account')
                ->dehydrated(false)
                ->readOnly(),

                TextInput::make('bank_account_secondary')
                ->label('Second Bank Account')
                ->dehydrated(false)
                ->readOnly(),
                
                Toggle::make('is_approved')
                ->helperText('Allow this company to join the community?')
                ->required(),
                
                Select::make('approved_by')
                ->relationship('user', 'name')
                ->label('Approved By')
                ->searchable()
                ->required(),

                DatePicker::make('approved_at')
                ->helperText("Select the exact time when you approved this company")
                ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                ->searchable()
                ->sortable(),
                
                IconColumn::make('is_approved')
                ->boolean(),

                TextColumn::make('created_at')
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
            'index' => Pages\ListRegistrations::route('/'),
            'create' => Pages\CreateRegistration::route('/create'),
            'edit' => Pages\EditRegistration::route('/{record}/edit'),
        ];
    }
}
