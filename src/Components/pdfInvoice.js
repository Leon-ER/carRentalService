import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    width: "90%",
    marginVertical: 15,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    border: "1px solid #e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  carInfo: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: "#333",
    lineHeight: 1.6,
  },
  total: {
    width: "90%",
    marginTop: 30,
    padding: 15,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    backgroundColor: "#e8f4e8",
    borderRadius: 8,
    color: "#2a7a2a",
  },
});

const CarPdfInvoice = ({ userEmail, selectedCar }) => {
  if (!selectedCar) {
    return null;
  }

  const { make, model, price } = selectedCar;
  const rentalDays = selectedCar.timeBorrowed ? selectedCar.timeBorrowed : 0; 
  const totalPrice = rentalDays * price;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <Text style={styles.header}>Car Rental Invoice</Text>

        {/* User Information */}
        <View style={styles.section}>
          <Text style={styles.label}>Renter's Email:</Text>
          <Text style={styles.text}>{userEmail}</Text>
        </View>

        {/* Car Information */}
        <View style={[styles.section, styles.carInfo]}>
          <Text style={styles.label}>Car Information:</Text>
          <Text style={styles.text}>Make: {make}</Text>
          <Text style={styles.text}>Model: {model}</Text>
          <Text style={styles.text}>Price per Day: ${price}</Text>
        </View>

        {/* Rental Details */}
        <View style={styles.section}>
          <Text style={styles.label}>Rental Duration:</Text>
          <Text style={styles.text}>{rentalDays} day(s)</Text>
        </View>

        {/* Total Price */}
        <Text style={styles.total}>Total Price: ${totalPrice}</Text>
      </Page>
    </Document>
  );
};

export const pdfInvoice = async (selectedCar, userEmail) => {
  if (!selectedCar) {
    alert("Selected car details are missing. Cannot generate invoice.");
    return;
  }

  const doc = <CarPdfInvoice userEmail={userEmail} selectedCar={selectedCar} />;

  const newWindow = window.open("", "_blank");

  try {
    const asPdf = pdf();
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();

    const blobUrl = URL.createObjectURL(blob);

    if (newWindow) {
      newWindow.location.href = blobUrl;
    } else {
      alert(
        "Failed to open a new window. Please check your popup blocker settings."
      );
    }
  } catch (err) {
    console.error("Failed to generate PDF:", err);
    alert("Failed to generate the invoice PDF. Please try again.");

    if (newWindow) {
      newWindow.close(); 
    }
  }
};
