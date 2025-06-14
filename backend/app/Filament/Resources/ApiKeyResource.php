<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ApiKeyResource\Pages;
use App\Filament\Resources\ApiKeyResource\RelationManagers;
use App\Models\ApiKey;
use Filament\Forms;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Auth;

class ApiKeyResource extends Resource
{
    protected static ?string $model = ApiKey::class;

    protected static ?string $navigationIcon = 'heroicon-o-lock-closed';

    public static function canAccess(): bool
    {
        return Auth::user()?->apiKey?->role === 'admin';
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                ->required()
                ->maxLength(255),

                TextInput::make('key')
                ->required()
                ->maxLength(255),

                Select::make('role')
                ->options([
                    'admin' => 'admin',
                    'company' => 'company',

                ])
                ->required(),

                Select::make('user_id')
                ->relationship('user', 'name')
                ->searchable()
                ->nullable(),
                
                Select::make('registration_id')
                ->relationship('registration', 'name')
                ->label('Company Name')
                ->helperText('Registered Company Name')
                ->searchable()
                ->nullable(),

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                ->searchable(),

                TextColumn::make('role')
                ->searchable()
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
            'index' => Pages\ListApiKeys::route('/'),
            'create' => Pages\CreateApiKey::route('/create'),
            'edit' => Pages\EditApiKey::route('/{record}/edit'),
        ];
    }
}
