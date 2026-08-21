export function getMonday ( date: Date = new Date() ): Date {
  const d = new Date( date );
  const day = d.getDay();
  const diff = d.getDate() - day + ( day === 0 ? -6 : 1 );
  return new Date( d.setDate( diff ) );
}

export function getWeekDays ( startDate?: Date ) {
  const monday = getMonday( startDate );
  const dayLabels = [ "L", "M", "M", "J", "V", "S", "D" ];

  return dayLabels.map( ( label, index ) => {
    const date = new Date( monday );
    date.setDate( monday.getDate() + index );
    return {
      label,
      date: date.getDate(),
      fullDate: date,
    };
  } );
}

export function getFirstDayOfMonth ( date: Date = new Date() ): Date {
  const firstDay = new Date( date );

  firstDay.setDate( 1 );
  firstDay.setHours( 0, 0, 0, 0 );

  return firstDay;
}

export function formatDate ( date: Date ): string {
  const newDate = new Date( date );
  const formattedDate = `${newDate.getDate()}/0${newDate.getMonth() + 1}/${newDate.getFullYear()}`;

  return formattedDate;
}

export function getWeekIndexInMonth ( dateString: string ): number {
  const [ y, m, d ] = dateString.split( "-" ).map( Number );
  const selected = new Date( y, m - 1, d );
  const firstOfMonth = new Date( y, m - 1, 1 );

  // Quel lundi précède ou est le 1er du mois
  const firstDay = firstOfMonth.getDay(); // 0=dim, 1=lun...
  const offset = firstDay === 0 ? -6 : 1 - firstDay;
  const firstMonday = new Date( firstOfMonth );
  firstMonday.setDate( 1 + offset );

  const diffMs = selected.getTime() - firstMonday.getTime();
  return Math.floor( diffMs / ( 7 * 24 * 60 * 60 * 1000 ) );
}

export function getTodayDate (): string {
  const today = new Date;
  today.setHours( 0 );
  today.setSeconds( 0 );

  return today.toDateString();
}