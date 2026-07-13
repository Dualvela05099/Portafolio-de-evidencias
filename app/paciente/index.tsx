import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { colors } from "@/components/theme";
import Card from "@/components/Card";
import LogoutButton from "@/components/LogoutButton";
import { authService } from "@/services/api/AuthService";
import { useGPS } from "@/hooks/useGPS";

const motivationalQuotes = [
  "Cada paso cuenta para cuidar tu salud.",
  "Hoy es un buen día para priorizar tu bienestar.",
  "Una pequeña acción hoy, es una gran mejora mañana.",
  "Confía en tu proceso y sigue avanzando.",
  "Tu salud es tu mejor inversión.",
  "Respira hondo y mantén la calma; estás en buen camino.",
  "Tu cuerpo te agradecerá por cuidarlo hoy.",
  "Cada cita es una oportunidad para estar mejor.",
  "Cuida tu mente tanto como tu cuerpo.",
  "La constancia es la mejor medicina." 
];

const specialtyOptions = [
  "Cardiología",
  "Pediatría",
  "Neurología",
  "Dermatología",
  "Ginecología",
  "Ortopedia",
  "Oftalmología",
  "Psicología",
  "Nutrición",
  "Medicina General",
];

const doctors = [
  { id: "1", name: "Dra. Carmen López", specialty: "Pediatría" },
  { id: "2", name: "Dr. Andrés Ramírez", specialty: "Cardiología" },
  { id: "3", name: "Dra. Lucía Herrera", specialty: "Dermatología" },
  { id: "4", name: "Dr. Raúl Méndez", specialty: "Neurología" },
  { id: "5", name: "Dra. Elena Vázquez", specialty: "Ginecología" },
  { id: "6", name: "Dr. Jorge Soto", specialty: "Ortopedia" },
  { id: "7", name: "Dra. Ana Torres", specialty: "Nutrición" },
];

export default function HomeScreen(){
  const { role } = useLocalSearchParams<{role?: string}>();
  const [greetingName, setGreetingName] = useState("Paciente");
  const [quote, setQuote] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const session = await authService.getSession();
      if (session) {
        const firstName = (session.name || session.nombre || "Paciente").split(" ")[0];
        setGreetingName(firstName || "Paciente");
      }
      setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    };
    loadData();
  }, []);

  if(role === 'medico') return <DoctorHome />;
  if(role === 'admin') return <AdminHome />;

  return (
    <UserHome
      greetingName={greetingName}
      quote={quote}
      selectedSpecialty={selectedSpecialty}
      setSelectedSpecialty={setSelectedSpecialty}
    />
  );
}

function UserHome({ greetingName, quote, selectedSpecialty, setSelectedSpecialty }:{ greetingName:string; quote:string; selectedSpecialty:string | null; setSelectedSpecialty:(value:string | null)=>void }){
  const filteredDoctors = useMemo(
    () =>
      selectedSpecialty
        ? doctors.filter((doc) => doc.specialty === selectedSpecialty)
        : doctors,
    [selectedSpecialty]
  );
  const { width, height } = useWindowDimensions();
  const { coords, available, refresh, format } = useGPS();
  const orientation = width > height ? "Horizontal" : "Vertical";

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>HOLA {greetingName.toUpperCase()}</Text>
            <Text style={styles.quote}>{quote}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => router.push("/paciente/perfil")} style={styles.profile}>
              <Ionicons name="person" size={34} color={colors.teal} />
            </TouchableOpacity>
            <LogoutButton compact />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Ionicons name="location-outline" size={18} color={colors.teal} />
              <View style={{ flex: 1 }}>
                <Text style={styles.statusLabel}>Ubicación actual</Text>
                <Text style={styles.statusValue}>
                  {available ? format || "Obteniendo ubicación..." : "GPS no disponible"}
                </Text>
              </View>
            </View>
            <View style={styles.statusRow}>
              <Ionicons name={orientation === "Horizontal" ? "phone-landscape-outline" : "phone-portrait-outline"} size={18} color={colors.teal} />
              <View style={{ flex: 1 }}>
                <Text style={styles.statusLabel}>Orientación de pantalla</Text>
                <Text style={styles.statusValue}>Pantalla {orientation}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickRow}>
            <Quick title={'Agendar\nCita'} icon="calendar-outline" bg="#e5f5ff" onPress={()=>router.push('/paciente/agendar-cita')} />
            <Quick title={'Mi\nHistorial'} icon="document-text-outline" bg="#e1fff3" onPress={()=>router.push('/paciente/mis-citas')} />
            <Quick title={'Mis\nRecetas'} icon="receipt-outline" bg="#fff5dc" selected onPress={()=>router.push('/paciente/scanner')} />
            <Quick title={'Mis\nMédicos'} icon="medical-outline" bg="#f2ddff" onPress={()=>router.push("/paciente/agenda")} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Especialidades</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.specialtyRow}>
            {specialtyOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.chip, selectedSpecialty === option && styles.chipSelected]}
                onPress={() => setSelectedSpecialty(selectedSpecialty === option ? null : option)}
              >
                <Text style={[styles.chipText, selectedSpecialty === option && styles.chipTextSelected]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Médicos Disponibles</Text>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} color="#d8e8f7" name={doctor.name} specialty={doctor.specialty} />
            ))
          ) : (
            <Text style={styles.noResults}>No hay doctores para esta especialidad.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
function Quick({title,icon,bg,onPress,selected}:{title:string;icon:any;bg:string;onPress?:()=>void;selected?:boolean}){return <TouchableOpacity onPress={onPress} style={[styles.quick,{backgroundColor:bg},selected&&styles.selected]}><Ionicons name={icon} size={24} color={colors.teal}/><Text style={styles.quickText}>{title}</Text></TouchableOpacity>}
function DoctorCard({color,name,specialty}:{color:string;name:string;specialty:string}){
  return (
    <TouchableOpacity style={styles.doctorCard} onPress={()=>router.push('/detalles-cita')}>
      <View style={styles.avatar} />
      <View style={{flex:1}}>
        <Text style={styles.docName}>{name}</Text>
        <Text style={styles.docSub}>{specialty}</Text>
      </View>
      <View style={[styles.statusLine,{backgroundColor:color}]} />
    </TouchableOpacity>
  );
}
function DoctorHome(){return <View style={styles.screen}><ScrollView contentContainerStyle={styles.scroll}><View style={styles.header}><View><Text style={styles.greetingSmall}>Bienvenido, Dr. Juan Pérez!</Text><Text style={styles.headerSub}>Cardiólogo</Text></View><View style={styles.headerActions}><TouchableOpacity onPress={() => router.push("/medico/perfil")} style={styles.profile}/><LogoutButton compact /></View></View><View style={styles.section}><Text style={styles.sectionTitle}>Resumen del día</Text><View style={styles.quickRow}><Stat n="8" l="Citas del día" c="#1976d2"/><Stat n="5" l="Pendientes" c="#20b26b"/><Stat n="1" l="En consulta" c="#f59e0b"/><Stat n="0" l="Canceladas" c="#c084fc"/></View></View><View style={styles.section}><Text style={styles.sectionTitle}>Próxima cita</Text><Patient name="María Gonzales" time="09:00 AM" /></View><View style={styles.section}><Text style={styles.sectionTitle}>Citas pendientes</Text>{['Pedro Venegas','Carmen Huerta','Rocio Duran'].map((n,i)=><Patient key={n} name={n} time={`${10+i}:30 AM`} />)}</View></ScrollView></View>}
function AdminHome(){return <View style={styles.screen}><ScrollView contentContainerStyle={styles.scroll}><View style={styles.header}><View><Text style={styles.greetingSmall}>Bienvenido, Administrador</Text><Text style={styles.headerSub}>Panel de control</Text></View><View style={styles.headerActions}><TouchableOpacity onPress={() => router.push("/admin/perfil")} style={styles.profile}/><LogoutButton compact /></View></View><View style={styles.section}><Text style={styles.sectionTitle}>Resumen del día</Text><View style={styles.quickRow}><Stat n="320" l="Médicos" c="#1976d2"/><Stat n="5" l="Pendientes" c="#20b26b"/><Stat n="154" l="Citas hoy" c="#f59e0b"/><Stat n="0" l="Canceladas" c="#c084fc"/></View></View><View style={styles.section}><Text style={styles.sectionTitle}>Citas hoy</Text><Card style={{padding:16}}><Text style={styles.rowText}>Confirmadas <Text style={styles.right}>88</Text></Text><Text style={styles.rowText}>Pendientes <Text style={styles.right}>28</Text></Text><Text style={styles.rowText}>Canceladas <Text style={styles.right}>4</Text></Text></Card></View><View style={styles.section}><Text style={styles.sectionTitle}>Avisos importantes</Text>{[1,2,3].map(i=><Patient key={i} name="Mantenimiento programado" time="10:00 AM" />)}</View></ScrollView></View>}
function Stat({n,l,c}:{n:string;l:string;c:string}){return <Card style={styles.stat}><Text style={[styles.statN,{color:c}]}>{n}</Text><Text style={styles.statL}>{l}</Text></Card>}
function Patient({name,time}:{name:string;time:string}){return <TouchableOpacity style={styles.patient}><View style={styles.avatar}/><View style={{flex:1}}><Text style={styles.docName}>{name}</Text><Text style={styles.docSub}>Control de rutina</Text></View><Text style={styles.time}>{time}</Text><Ionicons name="play" size={16} color={colors.teal}/></TouchableOpacity>}

const styles=StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f9f8' },
  scroll: { paddingBottom: 120 },
  header: { height: 104, backgroundColor: colors.teal, paddingHorizontal: 20, paddingTop: 24, flexDirection: 'row', justifyContent: 'space-between' },
  greeting: { color: 'white', fontSize: 18, fontWeight: '800', letterSpacing: 1 },
  quote: { color: 'white', fontSize: 12, opacity: 0.95, marginTop: 6, maxWidth: 260, lineHeight: 18 },
  greetingSmall: { color: 'white', fontSize: 15, fontWeight: '800' },
  headerSub: { color: 'white', fontSize: 12, opacity: 0.85, marginTop: 2 },
  profile: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#edf3ff', alignItems: 'center', justifyContent: 'center' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  section: { paddingHorizontal: 20, marginTop: 22 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: colors.text, marginBottom: 12 },
  statusCard: { backgroundColor: 'white', borderRadius: 16, padding: 14, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 3 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  statusLabel: { fontSize: 12, color: colors.muted, fontWeight: '700' },
  statusValue: { fontSize: 14, color: colors.text, fontWeight: '800', marginTop: 2 },
  quickRow: { flexDirection: 'row', gap: 10 },
  quick: { flex: 1, height: 84, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  selected: { borderWidth: 3, borderColor: '#1c9fe3' },
  quickText: { marginTop: 7, fontSize: 11, color: colors.text, fontWeight: '800', textAlign: 'center' },
  specialtyRow: { paddingVertical: 4, flexDirection: 'row', gap: 10 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, backgroundColor: 'white' },
  chipSelected: { backgroundColor: '#d9f1ff' },
  chipText: { fontSize: 13, color: '#5d5d68', fontWeight: '700' },
  chipTextSelected: { color: colors.teal },
  doctorCard: { backgroundColor: 'white', borderRadius: 18, padding: 14, marginBottom: 14, minHeight: 88, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.07, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 4 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#f1f5ff', marginRight: 14 },
  docName: { fontSize: 15, fontWeight: '900', color: colors.text },
  docSub: { fontSize: 13, color: colors.muted, marginTop: 2 },
  statusLine: { width: 112, height: 22, borderRadius: 20 },
  stat: { flex: 1, height: 80, alignItems: 'center', justifyContent: 'center' },
  statN: { fontSize: 22, fontWeight: '900' },
  statL: { fontSize: 9, color: colors.muted, textAlign: 'center', marginTop: 4 },
  patient: { backgroundColor: 'white', borderRadius: 18, padding: 14, marginBottom: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 3 },
  time: { fontSize: 11, color: colors.teal, marginLeft: 10, fontWeight: '900' },
  noResults: { color: colors.muted, fontSize: 14, textAlign: 'center', marginTop: 10 },
});
