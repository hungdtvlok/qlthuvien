package com.example.qlthuvien;


import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class SachActivity extends AppCompatActivity {
    private RecyclerView recyclerView;
    private SachAdapter sachAdapter;
    private List<Sach> sachList;
    private static final String URL_API = "http://10.0.2.2:5000/sach";
    // 10.0.2.2: dùng khi chạy Android Emulator để trỏ về localhost PC

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sach);

        recyclerView = findViewById(R.id.recyclerViewSach);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        sachList = new ArrayList<>();
        sachAdapter = new SachAdapter(this, sachList);
        recyclerView.setAdapter(sachAdapter);

        loadSachFromAPI();
    }

    private void loadSachFromAPI() {
        RequestQueue queue = Volley.newRequestQueue(this);

        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(
                Request.Method.GET,
                URL_API,
                null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        try {
                            sachList.clear();
                            for (int i = 0; i < response.length(); i++) {
                                JSONObject obj = response.getJSONObject(i);

                                String title = obj.getString("title");
                                String author = obj.getString("author");
                                String category = obj.getString("category");
                                int year = obj.getInt("published_year");
                                String status = obj.getString("status");
                                int quantity = obj.getInt("quantity");
                                String cover = obj.getString("cover_image");

                                sachList.add(new Sach(title, author, category, year, status, quantity, cover));
                            }
                            sachAdapter.notifyDataSetChanged();
                        } catch (JSONException e) {
                            e.printStackTrace();
                            Toast.makeText(SachActivity.this, "Lỗi parse JSON", Toast.LENGTH_SHORT).show();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Toast.makeText(SachActivity.this, "Lỗi tải dữ liệu", Toast.LENGTH_SHORT).show();
                    }
                }
        );

        queue.add(jsonArrayRequest);
    }
}
