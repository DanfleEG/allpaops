export const TRABAJADORES = [
  "Luis Alberto Quispe Mamani", "María Elena Flores Huanca", "Jorge Antonio Ramos Ccama", 
  "Rosa Milagros Condori Apaza", "Carlos Eduardo Puma Lazo", "Ana Lucía Tapia Soto", 
  "Pedro Pablo Vargas Huamán", "Lucía del Carmen Huanca Rios", "Marcos Aurelio Chávez Díaz", 
  "Elena Beatriz Castro Mora", "Raúl Ernesto Salinas Vega", "Carmen Rosa Paredes León", 
  "Miguel Ángel Torres Benites", "Diana Carolina Ruiz Peña", "Félix Ramón Gutiérrez López", 
  "Sonia Maribel Aguilar Cruz", "Roberto Jesús Navarro Reyes", "Patricia Isabel Lara Núñez", 
  "Antonio Francisco Medina Paz", "Juana Mercedes Ortega Vidal", "Hernán Augusto Villena Farfán", 
  "Isabel Cristina Romero Polo", "Óscar Renato Espinoza Tello", "Verónica Pilar Suárez Montes", 
  "Santiago Blas Cárdenas Huerta", "Miriam Yolanda Noriega Alva", "Enrique Joel Meza Carrasco", 
  "Giovanna Luz Céspedes Tafur", "Hugo César Ibáñez Palomino", "Natalia Esperanza Vega Yana"
];

export type EstadoLote = 'En Carencia Activa' | 'Listo para Cosecha' | 'Cosechado Seguro';

export const LOTES = [
  { nombre: "Lote A1", cultivo: "Arándano", hectareas: 12.5, carencia: 11, estado: "En Carencia Activa" as EstadoLote },
  { nombre: "Lote A2", cultivo: "Arándano", hectareas: 10.2, carencia: 9, estado: "En Carencia Activa" as EstadoLote },
  { nombre: "Lote A3", cultivo: "Arándano", hectareas: 14.0, carencia: 0, estado: "Cosechado Seguro" as EstadoLote },
  { nombre: "Lote B1", cultivo: "Uva", hectareas: 18.5, carencia: 16, estado: "En Carencia Activa" as EstadoLote },
  { nombre: "Lote B2", cultivo: "Uva", hectareas: 15.0, carencia: 0, estado: "Cosechado Seguro" as EstadoLote },
  { nombre: "Lote B3", cultivo: "Uva", hectareas: 20.1, carencia: 0, estado: "Cosechado Seguro" as EstadoLote },
  { nombre: "Lote C1", cultivo: "Palta", hectareas: 8.4, carencia: 5, estado: "En Carencia Activa" as EstadoLote },
  { nombre: "Lote C2", cultivo: "Palta", hectareas: 9.6, carencia: 0, estado: "Listo para Cosecha" as EstadoLote },
  { nombre: "Lote C3", cultivo: "Palta", hectareas: 11.2, carencia: 10, estado: "En Carencia Activa" as EstadoLote },
  { nombre: "Lote C4", cultivo: "Palta", hectareas: 10.5, carencia: 0, estado: "Listo para Cosecha" as EstadoLote }
];

export type Lote = typeof LOTES[0];

export const ERPS = [
  { id: 'sap', name: 'SAP' },
  { id: 'nisira', name: 'Nisira' },
  { id: 'spaceag', name: 'SpaceAG' },
  { id: 'agrisofia', name: 'Agri Sofia' },
  { id: 'cropwise', name: 'Cropwise (Syngenta)' },
  { id: 'agroptima', name: 'Agroptima' },
  { id: 'xfarm', name: 'xFarm' },
  { id: 'solinftec', name: 'Solinftec' },
  { id: 'johndeere', name: 'John Deere Operations Center' },
  { id: 'sourcetrace', name: 'SourceTrace' },
  { id: 'dehaat', name: 'DeHaat' }
];

export interface RegistroCosecha {
  id: string;
  fecha: string;
  trabajador: string;
  lote: string;
  cultivo: string;
  jabas: number;
}
