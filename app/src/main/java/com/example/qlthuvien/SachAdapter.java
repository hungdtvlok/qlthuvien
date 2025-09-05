package com.example.qlthuvien;




import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.squareup.picasso.Picasso;

import java.util.List;

public class SachAdapter extends RecyclerView.Adapter<SachAdapter.SachViewHolder> {
    private Context context;
    private List<Sach> sachList;

    public SachAdapter(Context context, List<Sach> sachList) {
        this.context = context;
        this.sachList = sachList;
    }

    @NonNull
    @Override
    public SachViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_sach, parent, false);
        return new SachViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull SachViewHolder holder, int position) {
        Sach sach = sachList.get(position);
        holder.tvTitle.setText(sach.getTitle());
        holder.tvAuthor.setText("Tác giả: " + sach.getAuthor());
        holder.tvCategory.setText("Thể loại: " + sach.getCategory());
        holder.tvYear.setText("Năm XB: " + sach.getPublishedYear());
        holder.tvStatus.setText("Trạng thái: " + sach.getStatus());
        holder.tvQuantity.setText("Số lượng: " + sach.getQuantity());

        // Load ảnh bìa bằng Picasso
        Picasso.get().load(sach.getCoverImage()).into(holder.imgCover);
    }

    @Override
    public int getItemCount() {
        return sachList.size();
    }

    public static class SachViewHolder extends RecyclerView.ViewHolder {
        ImageView imgCover;
        TextView tvTitle, tvAuthor, tvCategory, tvYear, tvStatus, tvQuantity;

        public SachViewHolder(@NonNull View itemView) {
            super(itemView);
            imgCover = itemView.findViewById(R.id.imgCover);
            tvTitle = itemView.findViewById(R.id.tvTitle);
            tvAuthor = itemView.findViewById(R.id.tvAuthor);
            tvCategory = itemView.findViewById(R.id.tvCategory);
            tvYear = itemView.findViewById(R.id.tvYear);
            tvStatus = itemView.findViewById(R.id.tvStatus);
            tvQuantity = itemView.findViewById(R.id.tvQuantity);
        }
    }
}

