/******************************************************************************

Welcome to GDB Online.
GDB online is an online compiler and debugger tool for C, C++, Python, Java, PHP, Ruby, Perl,
C#, OCaml, VB, Swift, Pascal, Fortran, Haskell, Objective-C, Assembly, HTML, CSS, JS, SQLite, Prolog.
Code, Compile, Run and Debug online from anywhere in world.

*******************************************************************************/
import java.io.*;
import java.util.*;

public class Main
{
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Prompt the user for an integer input
        System.out.print("Enter an integer: ");
        int n = scanner.nextInt();

       for ( int i = 1; i <= 2*n - 1; i++ ) {
            if ( i <= n ) {
            for ( int j = 1; j <= i - 1; j++ ) {
                System.out.print(". ");
                // cout << ". ";
            }
            System.out.print("* ");
            //  cout << "*  ";
            if ( i != n ) {
                for ( int j = 1; j <= 2 * (n - i) - 1; j++ ) {
                //   cout << "  ";
                System.out.print("  ");
                }
                System.out.print("* ");
                // cout << "*  ";
            }
            } else {
                for ( int j = 1; j <= (2 * n) - i - 1; j++ ) {
                    // cout << ". ";
                    System.out.print(". ");
                }
                System.out.print("* ");
            //  cout << "*  ";
                for ( int j = 1; j <= 2 * (i - n) - 1; j++ ) {
                // cout << "  ";
                    System.out.print("  ");
                }
                System.out.print("* ");
            //  cout << "*  ";
            }
            System.out.println();
        }
	}
}
