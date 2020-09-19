
export class ArchivoBiblioteca {

  constructor(
    public id?: number,
    public nombre?: string,
    public extension?: string,
    public tipo?: string,
    public id_usuario?: number,
    public id_salon?: number,
    public id_programacion_horario?: number,
    public totalPaginas?: number
  ) {
  }
}
