<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ReportResource\Pages;
use App\Filament\Resources\ReportResource\RelationManagers;
use App\Models\OfficeSpace;
use App\Models\Report;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Field;
use Filament\Forms\Components\Fieldset;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Group;
use Filament\Infolists\Components\TextEntry;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Auth;

class ReportResource extends Resource
{
    protected static ?string $model = Report::class;

    protected static ?string $navigationIcon = 'heroicon-o-exclamation-triangle';

    public static function canAccess(): bool
    {
        return Auth::user()?->apiKey?->role === 'admin';
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                ->dehydrated(false)
                ->readOnly(),

                DatePicker::make('created_at')
                ->dehydrated(false)
                ->readOnly(),

                Section::make('Booking Transaction Info')
                ->schema([
                    Fieldset::make('')
                    ->relationship('bookingTransaction')
                    ->schema([
                        TextInput::make('booking_trx_id')
                        ->label('Booking TRX ID')
                        ->dehydrated(false)
                        ->readOnly(),

                        Select::make('is_paid')
                        ->options([
                            true => 'Paid',
                            false => 'Not Paid'
                        ])
                        ->label('Payment Status')
                        ->disabled(),
                            
                        TextInput::make('name')
                        ->dehydrated(false)
                        ->readOnly(),
                            
                        TextInput::make('phone_number')
                        ->dehydrated(false)
                        ->readOnly(),
                        
                        TextInput::make('total_amount')
                        ->dehydrated(false)
                        ->readOnly(),
    
                        TextInput::make('duration')
                        ->dehydrated(false)
                        ->readOnly()
                        ->label('Duration in day(s)'),
                            
                        DatePicker::make('started_at')
                        ->dehydrated(false)
                        ->readOnly(),

                        DatePicker::make('ended_at')
                        ->dehydrated(false)
                        ->readOnly(),
                    ]),
                ]),

                Section::make('Office Space Info')
                ->relationship('bookingTransaction')
                ->schema([
                    Fieldset::make('')
                    ->relationship('officeSpace')
                    ->schema([
                        TextInput::make('name')
                        ->dehydrated(false)
                        ->columnSpan('full')
                        ->readOnly(),

                        TextInput::make('address')
                        ->dehydrated(false)
                        ->readOnly(),
                        
                        Group::make()
                        ->relationship('city')
                        ->schema([
                            TextInput::make('name')
                            ->label('City Name')
                            ->dehydrated(false)
                            ->readOnly(),
                        ]),

                        TextInput::make('price')
                        ->dehydrated(false)
                        ->readOnly(),

                        TextInput::make('duration')
                        ->dehydrated(false)
                        ->label('Duration in day(s)')
                        ->readOnly(),

                        TextInput::make('is_open')
                        ->label('Status')
                        ->formatStateUsing(fn (int $state): string => $state ? 'Open' : 'Closed')
                        ->helperText('Is the office open?')
                        ->dehydrated(false)
                        ->readOnly(),

                        TextInput::make('is_full_booked')
                        ->formatStateUsing(fn (int $state): string => $state ? 'Not Available' : 'Available')
                        ->label('Availability Status')
                        ->dehydrated(false)
                        ->readOnly(),
                    ])
                ]),

                Toggle::make('is_traced')
                ->helperText('Is this report has been traced?')
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

                IconColumn::make('is_traced')
                ->boolean()
                ->trueColor('success')
                ->falseColor('danger')
                ->trueIcon('heroicon-o-check-circle')
                ->falseIcon('heroicon-o-x-circle')
                ->label('Traced?'),

                TextColumn::make('created_at')
                ->dateTime()
                ->sortable()
                ->toggleable(),

                TextColumn::make('bookingTransaction.booking_trx_id')
                ->label('Booking TRX ID'),
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
            'index' => Pages\ListReports::route('/'),
            'create' => Pages\CreateReport::route('/create'),
            'edit' => Pages\EditReport::route('/{record}/edit'),
        ];
    }
}
