package com.example.qlthuvien;


import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

public class Admin extends AppCompatActivity {

    private Button btnSach, btnDocGia, btnMuonTra;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.admin); // file XML bạn gửi

        // Ánh xạ
        btnSach = findViewById(R.id.button);
        btnDocGia = findViewById(R.id.button2);
        btnMuonTra = findViewById(R.id.button3);

        // Sự kiện chuyển màn hình
        btnSach.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Admin.this, SachActivity.class);
                startActivity(intent);
            }
        });

        btnDocGia.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Admin.this, DocGiaActivity.class);
                startActivity(intent);
            }
        });

        btnMuonTra.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Admin.this, MuonTraActivity.class);
                startActivity(intent);
            }
        });
    }
}

