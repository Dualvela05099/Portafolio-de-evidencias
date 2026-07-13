import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform, Modal, Pressable, FlatList, TextInput } from "react-native";
import AppLogo from "@/components/ui/AppLogo";
import FormInput from "@/components/forms/FormInput";
import { colors } from "@/constants/theme";
import { useRegistroDatosViewModel } from "@/viewmodels/useRegistroDatosViewModel";

const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const dayNames = ["D", "L", "M", "M", "J", "V", "S"];

export default function DatosScreen() {
  const vm = useRegistroDatosViewModel();
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [tempDate, setTempDate] = useState(() => {
    const date = vm.fechaNacimiento ? new Date(vm.fechaNacimiento) : new Date();
    return isNaN(date.getTime()) ? new Date() : date;
  });
  const [yearSelectorOpen, setYearSelectorOpen] = useState(false);

  const formattedDate = useMemo(() => {
    if (!vm.fechaNacimiento) return "Selecciona tu fecha";
    const date = new Date(vm.fechaNacimiento);
    if (isNaN(date.getTime())) return "Selecciona tu fecha";
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  }, [vm.fechaNacimiento]);

  const daysInMonth = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(tempDate.getFullYear(), tempDate.getMonth(), 1).getDay();
  const emptySlots = Array.from({ length: firstDayIndex });
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  // Mantenemos la lista de nombres de día dentro del scope del componente
  const dayNamesSafe = ["D", "L", "M", "M", "J", "V", "S"];

  const selectSexo = (value: string) => vm.setSexo(value);
  const applySelectedDate = (day: number) => {
    const selected = new Date(tempDate.getFullYear(), tempDate.getMonth(), day);
    vm.setFechaNacimiento(selected.toISOString().slice(0, 10));
    setDatePickerOpen(false);
  };

  // Navegar meses (usado en web modal)
  const prevMonth = () => setTempDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setTempDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  // Seleccionar año rápidamente (usado en web modal)
  const selectYear = (y: number) => {
    setTempDate((d) => new Date(y, d.getMonth(), 1));
    setYearSelectorOpen(false);
  };

  // Years range for quick selection
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 120 }, (_, i) => currentYear - i); // últimos 120 años

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.phoneCard}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={vm.goBack}><Text style={styles.backText}>←</Text></TouchableOpacity>
          <AppLogo size={124} />
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Datos principales</Text>
          <Text style={styles.subtitle}>Registra una nueva cuenta</Text>
          <FormInput label="Nombre (s)" value={vm.nombre} onChangeText={vm.setNombre} />
          <FormInput label="Apellido paterno" value={vm.apellidoPaterno} onChangeText={vm.setApellidoPaterno} />
          <FormInput label="Apellido materno" value={vm.apellidoMaterno} onChangeText={vm.setApellidoMaterno} />
          <Text style={styles.label}>Sexo</Text>
          <View style={styles.sexRow}>
            {[
              { label: "Masculino", value: "masculino" },
              { label: "Femenino", value: "femenino" },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.sexOption,
                  vm.sexo === option.value && styles.sexOptionActive,
                ]}
                onPress={() => selectSexo(option.value)}
              >
                <Text style={[styles.sexOptionText, vm.sexo === option.value && styles.sexOptionTextActive]}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Fecha de nacimiento</Text>
          <TouchableOpacity style={styles.dateInput} onPress={() => setDatePickerOpen(true)}>
            <Text style={[styles.dateInputText, !vm.fechaNacimiento && styles.placeholderText]}>{formattedDate}</Text>
          </TouchableOpacity>
          {datePickerOpen && (
            Platform.OS === "web" ? (
              <Modal transparent animationType="fade" visible={datePickerOpen} onRequestClose={() => setDatePickerOpen(false)}>
                <View style={styles.modalBackdrop}>
                  <View style={[styles.calendarCard, { maxWidth: 420, width: "92%" }]}>
                    <View style={styles.calendarHeader}>
                      <TouchableOpacity onPress={prevMonth} accessibilityLabel="Mes anterior">
                        <Text style={styles.calendarNav}>‹</Text>
                      </TouchableOpacity>
                      <Pressable onPress={() => setYearSelectorOpen(true)} style={{ paddingHorizontal: 8 }} accessibilityRole="button">
                        <Text style={styles.calendarTitle}>{monthNames[tempDate.getMonth()]} {tempDate.getFullYear()}</Text>
                      </Pressable>
                      <TouchableOpacity onPress={nextMonth} accessibilityLabel="Mes siguiente">
                        <Text style={styles.calendarNav}>›</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.calendarWeekRow}>
                      {Array.isArray(dayNamesSafe) && dayNamesSafe.map((dayName, i) => (
                        <Text key={`${dayName}-${i}`} style={styles.calendarWeekText}>{dayName}</Text>
                      ))}
                    </View>

                    <View style={styles.calendarDaysGrid}>
                      {emptySlots.map((_, index) => (
                        <View key={`empty-${index}`} style={styles.calendarDayItem} />
                      ))}
                      {days.map((day) => (
                        <TouchableOpacity key={day} style={styles.calendarDayItem} onPress={() => applySelectedDate(day)}>
                          <Text style={styles.calendarDayText}>{day}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "flex-end", gap: 10 }}>
                      <TouchableOpacity onPress={() => setDatePickerOpen(false)} style={{ padding: 8 }}>
                        <Text style={{ color: "#666" }}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { vm.setFechaNacimiento(tempDate.toISOString().slice(0,10)); setDatePickerOpen(false); }} style={{ padding: 8 }}>
                        <Text style={{ color: colors.teal }}>Aceptar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Year selector overlay */}
                  <Modal transparent animationType="slide" visible={yearSelectorOpen} onRequestClose={() => setYearSelectorOpen(false)}>
                    <View style={styles.modalBackdrop}>
                      <View style={[styles.calendarCard, { maxHeight: 480, width: "90%" }]}>
                        <Text style={[styles.calendarTitle, { textAlign: "center" }]}>Selecciona año</Text>
                        <TextInput placeholder="Buscar año" keyboardType="numeric" style={{ borderWidth:1,borderColor:colors.border,padding:8,borderRadius:8,marginVertical:8 }} onSubmitEditing={(e) => {
                          const val = Number(e.nativeEvent.text);
                          if (!Number.isNaN(val)) selectYear(val);
                        }} />
                        <FlatList data={years} keyExtractor={(y) => String(y)} initialNumToRender={20} style={{ marginTop: 6 }} renderItem={({ item }) => (
                          <TouchableOpacity onPress={() => selectYear(item)} style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: "#eee" }}>
                            <Text style={{ textAlign: "center", fontWeight: item === tempDate.getFullYear() ? "900" : "400" }}>{item}</Text>
                          </TouchableOpacity>
                        )} />
                        <View style={{ marginTop: 8, flexDirection: "row", justifyContent: "space-between" }}>
                          <TouchableOpacity onPress={() => setYearSelectorOpen(false)} style={{ padding: 8 }}><Text style={{ color: "#666" }}>Cerrar</Text></TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View>
              </Modal>
            ) : (
              // Native platforms: attempt to require the community DateTimePicker dynamically.
              (() => {
                let NativePicker: any = null;
                try {
                  // require at runtime so web bundler doesn't attempt to resolve it
                  // eslint-disable-next-line @typescript-eslint/no-var-requires
                  NativePicker = require('@react-native-datetimepicker/datetimepicker').default;
                } catch (e) {
                  NativePicker = null;
                }

                if (NativePicker) {
                  return (
                    <NativePicker
                      value={tempDate}
                      mode="date"
                      display={Platform.OS === 'android' ? 'calendar' : 'spinner'}
                      maximumDate={new Date()}
                      onChange={(event: any, selected?: Date) => {
                        if (selected) {
                          setTempDate(selected);
                          vm.setFechaNacimiento(selected.toISOString().slice(0,10));
                        }
                        setDatePickerOpen(false);
                      }}
                    />
                  );
                }

                // Fallback native calendar UI if picker not available
                return (
                  <View style={styles.calendarCard}>
                    <View style={styles.calendarHeader}>
                      <TouchableOpacity onPress={prevMonth}><Text style={styles.calendarNav}>‹</Text></TouchableOpacity>
                      <Text style={styles.calendarTitle}>{monthNames[tempDate.getMonth()]} {tempDate.getFullYear()}</Text>
                      <TouchableOpacity onPress={nextMonth}><Text style={styles.calendarNav}>›</Text></TouchableOpacity>
                    </View>
                    <View style={styles.calendarWeekRow}>{Array.isArray(dayNamesSafe) && dayNamesSafe.map((d, i) => <Text key={`${d}-${i}`} style={styles.calendarWeekText}>{d}</Text>)}</View>
                    <View style={styles.calendarDaysGrid}>
                      {emptySlots.map((_, index) => <View key={`empty-${index}`} style={styles.calendarDayItem} />)}
                      {days.map((day) => (
                        <TouchableOpacity key={day} style={styles.calendarDayItem} onPress={() => applySelectedDate(day)}>
                          <Text style={styles.calendarDayText}>{day}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                );
              })()
            )
          )}
          <FormInput label="Teléfono celular" value={vm.telefono} onChangeText={vm.setTelefono} keyboardType="phone-pad" />
          <TouchableOpacity style={styles.button} onPress={vm.continuar}><Text style={styles.buttonText}>Continuar</Text></TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f3f3f3" },
  scroll: { alignItems: "center", paddingVertical: 28 },
  phoneCard: { width: "90%", maxWidth: 420, minHeight: 760, backgroundColor: "#fbfbfb", borderRadius: 26, overflow: "hidden" },
  header: { height: 270, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" },
  back: { position: "absolute", top: 34, left: 22, zIndex: 2 },
  backText: { color: "white", fontSize: 30 },
  card: { width: "86%", alignSelf: "center", marginTop: -54, backgroundColor: "white", borderRadius: 22, padding: 22, shadowColor: "#8ab7c2", shadowOpacity: 0.25, shadowOffset: { width: 0, height: 10 }, shadowRadius: 22, elevation: 8 },
  title: { color: colors.teal, fontSize: 24, fontWeight: "900" },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 6, marginBottom: 16 },
  label: { color: "#696969", fontSize: 13, marginLeft: 14, marginBottom: 8 },
  sexRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  sexOption: { flex: 1, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.input, alignItems: "center", justifyContent: "center", paddingVertical: 14 },
  sexOptionActive: { borderColor: colors.teal, backgroundColor: "#e8f7fb" },
  sexOptionText: { color: colors.text, fontSize: 14, fontWeight: "600" },
  sexOptionTextActive: { color: colors.teal },
  dateInput: { height: 50, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.input, justifyContent: "center", paddingHorizontal: 14, marginBottom: 16 },
  dateInputText: { color: colors.text, fontSize: 14 },
  placeholderText: { color: "#9aa3ae" },
  calendarCard: { borderRadius: 16, backgroundColor: "#f7fbff", padding: 14, borderWidth: 1, borderColor: "#dce8ef", marginBottom: 16 },
  calendarHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  calendarNav: { fontSize: 24, color: colors.teal, paddingHorizontal: 8 },
  calendarTitle: { color: colors.teal, fontSize: 16, fontWeight: "700" },
  calendarWeekRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  calendarWeekText: { width: 30, textAlign: "center", color: colors.muted, fontSize: 12 },
  calendarDaysGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  calendarDayItem: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center", marginBottom: 6, backgroundColor: "white" },
  calendarDayText: { color: colors.text, fontSize: 13 },
  button: { height: 54, borderRadius: 12, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center", marginTop: 4 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "900" },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", alignItems: "center", justifyContent: "center" },
});
