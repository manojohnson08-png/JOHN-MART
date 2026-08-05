# JOHN-MART
A modern e-commerce web application that enables users to browse products, manage their shopping cart, and place orders through a responsive and user-friendly interface. Built to demonstrate secure authentication, product management, and seamless online shopping.
import java.util.Scanner;

public class JOHNMART {

    static Scanner sc = new Scanner(System.in);

    public static void main(String[] args) {

        int choice;

        do {
            System.out.println("\n===== JOHN MART =====");
            System.out.println("1. Registration");
            System.out.println("2. Login");
            System.out.println("3. Admin Login");
            System.out.println("4. Exit");

            System.out.print("Enter your choice: ");
            choice = sc.nextInt();
            sc.nextLine();

            switch (choice) {

                case 1:
                    Registration.register();
                    break;

                case 2:
                    Login.login();
                    break;

                case 3:
                    AdminLogin.adminLogin();
                    break;

                case 4:
                    System.out.println("Thank you for using JOHN MART!");
                    break;

                default:
                    System.out.println("Invalid choice!");
            }

        } while (choice != 4);

        sc.close();
    }
}
