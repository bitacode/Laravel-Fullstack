<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OfficeSpaceResource\Pages;
use App\Filament\Resources\OfficeSpaceResource\RelationManagers;
use App\Models\OfficeSpace;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Group;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Auth;
use Ysfkaya\FilamentPhoneInput\Forms\PhoneInput;

class OfficeSpaceResource extends Resource
{
    protected static ?string $model = OfficeSpace::class;

    protected static ?string $navigationIcon = 'heroicon-o-building-office-2';

    public static function getEloquentQuery(): Builder
    {
        $user = Auth::user();

        $role = $user?->apiKey?->role ?? 'company';

        if ($role === 'admin') {
            return OfficeSpace::query();
        }

        return OfficeSpace::where('user_id', $user?->id);
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                ->required()
                ->maxLength(255),
                
                TextInput::make('address')
                ->required()
                ->maxLength(255),

                FileUpload::make('thumbnail')
                ->image()
                ->required(),

                Textarea::make('about')
                ->required()
                ->rows(10)
                ->cols(20),

                Repeater::make('photos')
                ->relationship('photos')
                ->schema([
                    FileUpload::make('photo')
                    ->required()
                ]),
                
                Select::make('category_id')
                ->relationship('category', 'name')
                ->searchable()
                ->preload()
                ->required(),

                Repeater::make('benefits')
                ->relationship('benefits')
                ->schema([
                    Select::make('name')
                    ->options([
                        'Safe Environment' => 'Safe Environment',
                        'Free Printing' => 'Free Printing',
                        'Special Price for Student' => 'Student Price',
                        'Strategic Location' => 'Strategic Location',
                        'Free Mineral Water' => 'Free Mineral Water',
                        'Cafetaria' => 'Cafetaria',
                        'Fast Internet Speed' => 'Fast Internet Speed',
                        'Free Snack & Beverage' => 'Free S&B',
                        'Various Facilities' => 'Various Facilities'
                    ])
                    ->required()
                ])
                ->maxItems(3),

                Repeater::make('contacts')
                ->relationship('contacts')
                ->schema([
                    Grid::make(['md' => 2])
                    ->schema([
                        Group::make([
                            TextInput::make('name')
                            ->label('Contact Name')
                            ->placeholder('Ex: Bintang Purnama')
                            ->required()
                            ->maxLength(255),
                            
                            TextInput::make('role')
                            ->placeholder('Sales Manager or Hotline etc.')
                            ->required()
                            ->maxLength(255),
                            
                            PhoneInput::make('telephone_number')
                            ->initialCountry('id')
                            ->separateDialCode(true)
                            ->required(),
                            
                            PhoneInput::make('whatsapp_number')
                            ->initialCountry('id')
                            ->separateDialCode(true)
                            ->required(),
                        ]),
                        FileUpload::make('photo')
                        ->image()
                        ->panelAspectRatio('1:1')
                        ->required(),
                    ]),
                ]),
                
                Select::make('city_id')
                ->relationship('city', 'name')
                ->searchable()
                ->preload()
                ->required(),

                Select::make('user_id')
                ->relationship('user', 'name')
                ->label('Company Name')
                ->searchable()
                ->live()
                ->afterStateUpdated(function ($state, Set $set) {
                    if ($state) {
                        $user = \App\Models\User::with('registration')->find($state);
                        $set('registration_id', $user->registration->first()?->id);
                    } else {
                        $set('registration_id', null);
                    }
                })
                ->nullable()
                ->disabled(fn() => Auth::user()?->apiKey?->role === 'company'),

                Hidden::make('registration_id')
                ->dehydrated()
                ->nullable(),

                TextInput::make('price')
                ->required()
                ->numeric()
                ->prefix('IDR'),

                TextInput::make('duration')
                ->required()
                ->numeric()
                ->prefix('Days'),

                Select::make('is_open')
                ->options([
                    true => 'Open',
                    false => 'Not Open'
                ])
                ->required(),

                Select::make('is_full_booked')
                ->options([
                    true => 'Not Available',
                    false => 'Available'
                ])
                ->required()
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                ->searchable(),

                ImageColumn::make('thumbnail'),
                
                TextColumn::make('city.name'),

                IconColumn::make('is_full_booked')
                ->boolean()
                ->trueColor('danger')
                ->falseColor('success')
                ->trueIcon('heroicon-o-x-circle')
                ->falseIcon('heroicon-o-check-circle')
                ->label('Available')
            ])
            ->filters([
                SelectFilter::make('city_id')
                ->label('City')
                ->relationship('city', 'name')
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->disabled(fn() => Auth::user()?->apiKey?->role === 'company'),
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
            'index' => Pages\ListOfficeSpaces::route('/'),
            'create' => Pages\CreateOfficeSpace::route('/create'),
            'edit' => Pages\EditOfficeSpace::route('/{record}/edit'),
        ];
    }
}
